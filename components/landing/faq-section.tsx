"use client";

import {
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "什麼是專業履歷？撰寫履歷的目的是什麼？",
      answer: "專業履歷是您過往經歷、技能與成就的摘要，能幫助您展現自身能力並說服招聘者錄用您。撰寫履歷的目的是吸引招聘者的注意，並從應聘候選人中脫穎而出。"
    },
    {
      question: "什麼是 AI 履歷編輯器？",
      answer: "AI 履歷編輯器是一款可以幫助您快速打造專業簡歷的工具。寫履歷有很多麻煩的地方，例如研究履歷撰寫原則、設計履歷格式、調整內容呈現形式、反覆修飾文句等，這些過程非常惱人且費時，但 AI 履歷編輯器能為您代勞，您不需要任何先備知識，透過 AI 履歷顧問的引導，就能快速創建極具競爭力的履歷。"
    },
    {
      question: "能使用 ChatGPT 創建履歷嗎？RenderResume 有何優勢？",
      answer: "如今大多數求職者都在求職過程中使用了 AI，但是並不建議單純使用 ChatGPT 創建簡歷。ChatGPT 是一款通用的 LLM，並不精通於為您量身定制專業履歷。RenderResume 的 AI 履歷編輯器使用 ChatGPT 的 AI 模型，並經過專業的履歷撰寫訓練，精通於為您量身定制專業履歷，並確保履歷寫法都遵循業界的最佳實踐。"
    },
    {
      question: "上傳的個人資料會被如何處理？",
      answer: "我們非常注重用戶隱私，您上傳的一切資料都僅用於分析產生針對您個人履歷的優化建議。我們不會將您的資料用於訓練我們的模型，也不會用於任何其他用途。所有資料的傳輸與儲存都會經過妥善加密保護。"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          常見問題
        </h2>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={`item-${index}`} className="border-none">
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 dark:text-white px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg hover:no-underline [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-gray-500 [&>svg]:flex-shrink-0">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-700 dark:text-gray-300 leading-relaxed px-6 pb-4">
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link 
          href="/faq"
          className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          查看更多常見問題
        </Link>
      </div>
      </div>
    </section>
  );
}
