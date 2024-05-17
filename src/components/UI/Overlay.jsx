import ReactDOM from "react-dom";
import { motion } from "framer-motion";

const portalElement = document.getElementById("overlays");

function Overlay() {
  return (
    <>
      {ReactDOM.createPortal(
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        ></motion.div>,
        portalElement
      )}
    </>
  );
}

export default Overlay;
