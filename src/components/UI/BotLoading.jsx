import { motion } from "framer-motion";

import styles from "./BotLoading.module.css";

const parentVariants = {
  hidden: {
    opacity: 0,
  },
  bounce: {
    opacity: 1,
    transition: {
      delay: 0.5,      
      staggerChildren: 0.3,
    },
  },
}

const ballVariants = {  
  bounce: {
    y: [0, -3, -4, -3, 0, 3, 4, 3, 0],
    opacity: [1, 0.5, 0.2, 0, 0.2, 0.5, 1],
    transition: {
      ease: "easeIn",
      duration: 1,
      repeat: Infinity,
    },
  },
};

function BotLoading() {
  return (
    <motion.div
      className={styles["loader__container"]}
      variants={parentVariants}
      initial="hidden"
      animate="bounce"
    >
      <motion.div
        className={styles["loader__ball"]}
        variants={ballVariants}
        // initial="hidden"
      ></motion.div>
      <motion.div
        className={styles["loader__ball"]}
        variants={ballVariants}
        // initial="hidden"
      ></motion.div>
      <motion.div
        className={styles["loader__ball"]}
        variants={ballVariants}
        // initial="hidden"
      ></motion.div>
    </motion.div>
  );
}

export default BotLoading;
