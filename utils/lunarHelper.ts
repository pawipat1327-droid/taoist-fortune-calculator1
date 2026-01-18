import { Solar } from 'lunar-javascript';
import { UserData, LunarAnalysisData } from '../types';

/**
 * Extracts User BaZi from birth data.
 */
export const analyzeDestiny = (userData: UserData): LunarAnalysisData => {
  try {
    // 1. Process Birth Date (Solar to Lunar/BaZi)
    if (!userData.birthDate) throw new Error("Missing birth date");
    const birthDateParts = userData.birthDate.split('-').map(Number);
    if (birthDateParts.length !== 3 || birthDateParts.some(isNaN)) {
        throw new Error("Invalid birth date format");
    }
    const birthSolar = Solar.fromYmd(birthDateParts[0], birthDateParts[1], birthDateParts[2]);
    const birthLunar = birthSolar.getLunar();
    
    // Extract simple Time Branch character (e.g. "子 (23-1)" -> "子")
    const timeBranch = userData.birthHour ? userData.birthHour.charAt(0) : '子';
    
    const userBaZi = {
      year: birthLunar.getYearInGanZhi(),
      month: birthLunar.getMonthInGanZhi(),
      day: birthLunar.getDayInGanZhi(),
      time: timeBranch,
      animal: birthLunar.getYearShengXiao(),
      dayElement: birthLunar.getDayGan(),
    };

    return { userBaZi };
  } catch (e) {
    console.error("Lunar Analysis Error", e);
    // Return safe default
    return {
       userBaZi: { year: '甲子', month: '甲子', day: '甲子', time: '子', animal: '鼠', dayElement: '甲' },
    };
  }
};