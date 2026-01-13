import { Solar, Lunar, LunarYear } from 'lunar-javascript';
import { UserData, LunarAnalysisData, PredictionScope } from '../types';

/**
 * Converts the user inputs and target date into a structured Lunar Analysis
 * to be used as context for the AI.
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
      dayElement: birthLunar.getDayTianGan(), // Rough approximation of Day Master for prompt context
    };

    // 2. Process Target Date based on Scope
    if (!userData.targetDate) throw new Error("Missing target date");
    const targetDateParts = userData.targetDate.split('-').map(Number);
    if (targetDateParts.length !== 3 || targetDateParts.some(isNaN)) {
        // Fallback to today if target date is somehow invalid
        const now = new Date();
        targetDateParts[0] = now.getFullYear();
        targetDateParts[1] = now.getMonth() + 1;
        targetDateParts[2] = now.getDate();
    }
    
    let targetLunar: Lunar;
    
    // For Month/Year scope, we still create a Lunar object from the selected date
    // But we focus on different properties in the return object.
    const targetSolar = Solar.fromYmd(targetDateParts[0], targetDateParts[1], targetDateParts[2]);
    targetLunar = targetSolar.getLunar();

    // 3. Extract Target Info
    let targetInfo: any = {};
    let conflictStatus = "";

    if (userData.scope === PredictionScope.YEAR) {
      const year = targetLunar.getYear();
      const lunarYear = LunarYear.fromYear(year);
      
      targetInfo = {
        lunarDateStr: `${year}年 (${lunarYear.getGanZhi()}年)`,
        ganZhi: lunarYear.getGanZhi(),
        yi: ["祭祀", "祈福"], // Generic for year, AI will expand
        ji: ["动土"],
        chong: lunarYear.getChong() + " (冲太岁)",
        wuxing: lunarYear.getNaYin(),
        shenSha: [`太岁:${lunarYear.getTaiSui()}`],
      };

      // Simple conflict check: Birth Zodiac vs Target Year Zodiac
      if (lunarYear.getZhi() === birthLunar.getYearZhi()) {
          conflictStatus = "本命年 (值太岁)";
      } else if (Lunar.Util.CHONG[lunarYear.getZhi()] === birthLunar.getYearZhi()) {
          conflictStatus = "冲太岁 (岁破)";
      } else {
          conflictStatus = "太岁相安";
      }

    } else if (userData.scope === PredictionScope.MONTH) {
      targetInfo = {
        lunarDateStr: `${targetLunar.getYear()}年 ${targetLunar.getMonthInChinese()}月`,
        ganZhi: targetLunar.getMonthInGanZhi(),
        yi: targetLunar.getDayYi(), 
        ji: targetLunar.getDayJi(),
        chong: "月破" + targetLunar.getMonthChong(),
        wuxing: targetLunar.getMonthNaYin(),
        shenSha: [],
      };
      conflictStatus = "流月轮转";

    } else {
      // Day Scope
      targetInfo = {
        lunarDateStr: targetLunar.toString(),
        ganZhi: `${targetLunar.getDayInGanZhi()}日`,
        yi: targetLunar.getDayYi(),
        ji: targetLunar.getDayJi(),
        chong: `冲${targetLunar.getDayChongDesc()}`,
        wuxing: targetLunar.getDayNaYin(),
        shenSha: targetLunar.getDayShenSha(),
      };
      
      // Check if Day Branch conflicts with User Year Branch (Day Clash)
      conflictStatus = targetLunar.getDayChongDesc().includes(birthLunar.getYearShengXiao()) 
        ? "日冲生肖 (Day clashes with Zodiac)" 
        : "日支平稳";
    }

    return {
      userBaZi,
      targetInfo,
      conflictStatus
    };
  } catch (e) {
    console.error("Lunar Analysis Error", e);
    // Return safe default to prevent crash, AI will have to handle generic context
    return {
       userBaZi: { year: '甲子', month: '甲子', day: '甲子', time: '子', animal: '鼠', dayElement: '甲' },
       targetInfo: { lunarDateStr: '未知', ganZhi: '未知', yi: [], ji: [], chong: '', wuxing: '', shenSha: [] },
       conflictStatus: "信息有误"
    };
  }
};