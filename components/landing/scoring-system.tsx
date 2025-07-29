interface ScoreCategory {
  icon: string;
  name: string;
  description: string;
  weight: string;
}

interface ScoringSystemProps {
  scoreCategories: ScoreCategory[];
}

export default function ScoringSystem({ scoreCategories }: ScoringSystemProps) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/70 backdrop-blur-sm border-y border-gray-200 dark:border-gray-700" itemScope itemType="https://schema.org/Service">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" itemProp="name">
            六維度專業評分架構
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" itemProp="description">
            採用國際頂級獵頭公司標準，結合 Fortune 500 企業人才評估框架，
            為您提供最專業的履歷分析與等第制評分
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto" itemScope itemType="https://schema.org/ItemList">
          {scoreCategories.map((category, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow" itemScope itemType="https://schema.org/Service">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3" role="img" aria-label={category.name}>{category.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white" itemProp="name">
                    {category.name}
                  </h3>
                  <span className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                    權重 {category.weight}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed" itemProp="description">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 