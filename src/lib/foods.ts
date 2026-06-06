// src/lib/foods.ts
export interface FoodItem {
  name: string
  kcalPer100g: number
  carbsPer100g: number
  proteinPer100g: number
  fatPer100g: number
  category: 'staple' | 'protein' | 'vegetable' | 'fruit' | 'dairy' | 'snack'
}

export const FOOD_DB: FoodItem[] = [
  // 主食 (staple)
  { name: '米饭',     kcalPer100g: 116, carbsPer100g: 25.9, proteinPer100g: 2.6,  fatPer100g: 0.3,  category: 'staple' },
  { name: '糙米饭',   kcalPer100g: 123, carbsPer100g: 25.6, proteinPer100g: 2.7,  fatPer100g: 0.9,  category: 'staple' },
  { name: '全麦面包', kcalPer100g: 247, carbsPer100g: 41.3, proteinPer100g: 13.0, fatPer100g: 3.4,  category: 'staple' },
  { name: '燕麦',     kcalPer100g: 377, carbsPer100g: 66.3, proteinPer100g: 13.5, fatPer100g: 6.7,  category: 'staple' },
  { name: '红薯',     kcalPer100g: 86,  carbsPer100g: 20.1, proteinPer100g: 1.6,  fatPer100g: 0.1,  category: 'staple' },
  { name: '玉米',     kcalPer100g: 112, carbsPer100g: 22.8, proteinPer100g: 4.0,  fatPer100g: 1.2,  category: 'staple' },
  { name: '面条',     kcalPer100g: 138, carbsPer100g: 25.0, proteinPer100g: 4.5,  fatPer100g: 1.5,  category: 'staple' },

  // 蛋白质 (protein)
  { name: '鸡胸肉',   kcalPer100g: 133, carbsPer100g: 0,    proteinPer100g: 31.0, fatPer100g: 1.2,  category: 'protein' },
  { name: '鸡蛋',     kcalPer100g: 144, carbsPer100g: 2.8,  proteinPer100g: 13.3, fatPer100g: 8.8,  category: 'protein' },
  { name: '三文鱼',   kcalPer100g: 208, carbsPer100g: 0,    proteinPer100g: 20.4, fatPer100g: 13.4, category: 'protein' },
  { name: '瘦牛肉',   kcalPer100g: 125, carbsPer100g: 0.2,  proteinPer100g: 22.3, fatPer100g: 3.5,  category: 'protein' },
  { name: '豆腐',     kcalPer100g: 73,  carbsPer100g: 1.9,  proteinPer100g: 8.1,  fatPer100g: 3.7,  category: 'protein' },
  { name: '虾仁',     kcalPer100g: 99,  carbsPer100g: 0.2,  proteinPer100g: 20.3, fatPer100g: 1.4,  category: 'protein' },
  { name: '牛奶',     kcalPer100g: 66,  carbsPer100g: 5.0,  proteinPer100g: 3.2,  fatPer100g: 3.6,  category: 'dairy' },
  { name: '酸奶',     kcalPer100g: 61,  carbsPer100g: 9.3,  proteinPer100g: 3.5,  fatPer100g: 1.2,  category: 'dairy' },

  // 蔬菜 (vegetable)
  { name: '西兰花',   kcalPer100g: 34,  carbsPer100g: 6.6,  proteinPer100g: 2.8,  fatPer100g: 0.4,  category: 'vegetable' },
  { name: '菠菜',     kcalPer100g: 23,  carbsPer100g: 3.6,  proteinPer100g: 2.9,  fatPer100g: 0.4,  category: 'vegetable' },
  { name: '番茄',     kcalPer100g: 18,  carbsPer100g: 3.9,  proteinPer100g: 0.9,  fatPer100g: 0.2,  category: 'vegetable' },
  { name: '黄瓜',     kcalPer100g: 16,  carbsPer100g: 2.9,  proteinPer100g: 0.7,  fatPer100g: 0.2,  category: 'vegetable' },
  { name: '胡萝卜',   kcalPer100g: 41,  carbsPer100g: 9.6,  proteinPer100g: 0.9,  fatPer100g: 0.2,  category: 'vegetable' },
  { name: '生菜',     kcalPer100g: 15,  carbsPer100g: 2.9,  proteinPer100g: 1.4,  fatPer100g: 0.2,  category: 'vegetable' },

  // 水果 (fruit)
  { name: '苹果',     kcalPer100g: 52,  carbsPer100g: 14.0, proteinPer100g: 0.3,  fatPer100g: 0.2,  category: 'fruit' },
  { name: '香蕉',     kcalPer100g: 89,  carbsPer100g: 22.8, proteinPer100g: 1.1,  fatPer100g: 0.3,  category: 'fruit' },
  { name: '橙子',     kcalPer100g: 47,  carbsPer100g: 11.8, proteinPer100g: 0.9,  fatPer100g: 0.1,  category: 'fruit' },
  { name: '蓝莓',     kcalPer100g: 57,  carbsPer100g: 14.5, proteinPer100g: 0.7,  fatPer100g: 0.3,  category: 'fruit' },

  // 健康脂肪/小食
  { name: '坚果',     kcalPer100g: 607, carbsPer100g: 16.0, proteinPer100g: 20.0, fatPer100g: 53.0, category: 'snack' },
  { name: '牛油果',   kcalPer100g: 160, carbsPer100g: 8.5,  proteinPer100g: 2.0,  fatPer100g: 14.7, category: 'snack' },
]
