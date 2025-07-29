import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from 'react';
import { toast } from "sonner";

const unitLabel = {
  days: '天',
  hours: '小時',
  minutes: '分',
  seconds: '秒',
};

const CountdownNumber = ({ value, unit }: { value: number; unit: string }) => {
  const getMaxValue = (unit: string) => {
    switch (unit) {
      case 'days': return 37;
      case 'hours': return 23;
      case 'minutes': return 59;
      case 'seconds': return 59;
      default: return 99;
    }
  };

  const count = useMotionValue(getMaxValue(unit));
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const display = useTransform(rounded, (latest) => String(latest).padStart(2, '0'));

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [value, unit, count]);

  return <motion.span>{display}</motion.span>;
};

const CountdownTimer = () => {
  const launchDate = new Date('2025-08-04T00:00:00+08:00').getTime();
  const startDate = new Date('2025-06-27T00:00:00+08:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;
      const totalDuration = launchDate - startDate;
      const elapsed = now - startDate;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setProgress(100);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });

      setProgress(Math.min(100, (elapsed / totalDuration) * 100));
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate, startDate]);

  const handleRemoClick = () => {
    toast("🐧 哈囉～我是 RenderResume 的 AI 履歷顧問 Remo！我的使命是幫助你在最短時間內呈現最大價值，找到理想工作！拍拍翅膀，讓我們一起打造完美履歷吧！", {
      duration: 5000,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 p-6 pt-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-600 dark:text-gray-200">Beta 上線倒數，期待與您相見！</h3>
      </div>

      <div className="flex justify-center space-x-4 text-gray-900 dark:text-white mb-6">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="text-center">
            <motion.div 
              className="text-2xl font-bold text-cyan-600 dark:text-cyan-400"
              initial={{ 
                opacity: 0,
                scale: 0.5,
                y: 20
              }}
              animate={{ 
                opacity: 1,
                scale: 1,
                y: 0
              }}
              transition={{ 
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut"
              }}
            >
              <CountdownNumber value={value} unit={unit} />
            </motion.div>
            <motion.div 
              className="text-xs uppercase text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.6,
                delay: 0.4,
                ease: "easeOut"
              }}
            >
              {unitLabel[unit as keyof typeof unitLabel]}
            </motion.div>
          </div>
        ))}
      </div>


      
      <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-cyan-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-wave-pattern opacity-30 animate-wave"></div>
        </motion.div>
        <motion.div 
            className="absolute -top-4 transform -translate-x-1/2"
            initial={{ left: 0 }}
            animate={{ left: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
        >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleRemoClick}>
                    <Avatar 
                      className="h-10 w-10 hover:scale-105 transition-transform duration-500 cursor-pointer animate-swing hover:animate-none shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                      style={{ animationDuration: '2s' }}
                    >
                      <AvatarImage src="/images/remo.png" alt="Remo" />
                      <AvatarFallback>R</AvatarFallback>
                    </Avatar>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Cute Wave Effect Under Penguin */}
            <motion.div
              className="absolute top-12 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: progress > 0 ? 1 : 0,
                scale: progress > 0 ? 1 : 0
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut"
              }}
            >
              <div className="relative">
                {/* Bubbles - More spread out horizontally with deeper colors */}
                <motion.div
                  className="absolute -top-2 -left-4 w-2 h-2 bg-cyan-500/90 rounded-full"
                  animate={{
                    y: [-2, -8, -2],
                    opacity: [0.8, 0.3, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute -top-1 -left-2.5 w-1.5 h-1.5 bg-cyan-400/95 rounded-full"
                  animate={{
                    y: [-1, -6, -1],
                    opacity: [0.9, 0.4, 0.9]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2
                  }}
                />
                <motion.div
                  className="absolute -top-3 -left-1 w-1 h-1 bg-cyan-300/85 rounded-full"
                  animate={{
                    y: [-3, -10, -3],
                    opacity: [0.85, 0.4, 0.85]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4
                  }}
                />
                <motion.div
                  className="absolute -top-2 left-0.5 w-1.5 h-1.5 bg-cyan-500/80 rounded-full"
                  animate={{
                    y: [-2, -7, -2],
                    opacity: [0.8, 0.3, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6
                  }}
                />
                <motion.div
                  className="absolute -top-1 left-2 w-1 h-1 bg-cyan-400/90 rounded-full"
                  animate={{
                    y: [-1, -5, -1],
                    opacity: [0.9, 0.4, 0.9]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8
                  }}
                />
                <motion.div
                  className="absolute -top-3 left-3.5 w-1.5 h-1.5 bg-cyan-300/85 rounded-full"
                  animate={{
                    y: [-3, -9, -3],
                    opacity: [0.85, 0.3, 0.85]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.0
                  }}
                />
                <motion.div
                  className="absolute -top-2 right-0.5 w-1 h-1 bg-cyan-500/75 rounded-full"
                  animate={{
                    y: [-2, -6, -2],
                    opacity: [0.75, 0.2, 0.75]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2
                  }}
                />
                <motion.div
                  className="absolute -top-1 right-2 w-1.5 h-1.5 bg-cyan-400/90 rounded-full"
                  animate={{
                    y: [-1, -4, -1],
                    opacity: [0.9, 0.3, 0.9]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.4
                  }}
                />
                <motion.div
                  className="absolute -top-3 right-3.5 w-1 h-1 bg-cyan-300/80 rounded-full"
                  animate={{
                    y: [-3, -8, -3],
                    opacity: [0.8, 0.3, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.6
                  }}
                />
                <motion.div
                  className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-cyan-500/85 rounded-full"
                  animate={{
                    y: [-2, -7, -2],
                    opacity: [0.85, 0.3, 0.85]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.8
                  }}
                />
                <motion.div
                  className="absolute -top-1 -right-4 w-1 h-1 bg-cyan-400/90 rounded-full"
                  animate={{
                    y: [-1, -5, -1],
                    opacity: [0.9, 0.4, 0.9]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2.0
                  }}
                />
                <motion.div
                  className="absolute -top-2 -right-5 w-1.5 h-1.5 bg-cyan-300/85 rounded-full"
                  animate={{
                    y: [-2, -6, -2],
                    opacity: [0.85, 0.3, 0.85]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2.2
                  }}
                />
                <motion.div
                  className="absolute -top-3 -left-5 w-1 h-1 bg-cyan-500/80 rounded-full"
                  animate={{
                    y: [-3, -9, -3],
                    opacity: [0.8, 0.3, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2.4
                  }}
                />
              </div>
            </motion.div>
        </motion.div>
      </div>
      <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>06.27 Waitlist 開放</span>
        <span>08.04 Beta 上線</span>
      </div>
      <style jsx>{`
        .bg-wave-pattern {
          background: linear-gradient(90deg, rgba(255,255,255,0) 50%, rgba(255,255,255,0.5) 50%);
          background-size: 50px 25px;
        }
      `}</style>
    </div>
  );
};

export default CountdownTimer; 