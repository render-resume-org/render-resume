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
import { faqs } from "../lib/landing-content";

export default function FAQSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-800">
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
