import { motion } from "framer-motion";

import styles from "./BotLoading.module.css";

const parentVariants = {
  bounce: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
    },
  },
}

const ballVariants = {
  bounce: {
    y: [null, -3, -4, -3, 0, 3, 4, 3, 0],
    opacity: [null, 0.5, 0.2, 0, 0.2, 0.5, 1],
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
      initial={{opacity: 0}}
      animate="bounce"
    >
      <motion.div
        className={styles["loader__ball"]}
        variants={ballVariants}
        initial={null}        
      ></motion.div>
      <motion.div
        className={styles["loader__ball"]}
        variants={ballVariants}
        initial={null}        
      ></motion.div>
      <motion.div
        className={styles["loader__ball"]}
        variants={ballVariants}
        initial={null}        
      ></motion.div>
    </motion.div>
  );
}

export default BotLoading;
