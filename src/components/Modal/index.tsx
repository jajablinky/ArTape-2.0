import { motion } from "framer-motion";
import Backdrop from "../Backdrop";
import styles from "@/styles/Home.module.css";
import AudioPlayer from "../AudioPlayer";

const dropIn = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: {
    y: "0",
    opacity: 1,
    transition: { duration: 0.1, type: "spring", damping: 25, stiffness: 500 },
  },
  exit: { y: "100vh", opacity: 0 },
};

const Modal = ({ handleClose, text }) => {
  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="ext"
      ></motion.div>
    </Backdrop>
  );
};

export default Modal;
