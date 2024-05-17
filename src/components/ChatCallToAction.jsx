import DocGuide from '../assets/female-doctor-to-guide-svgrepo-com.svg'
import style from "./ChatCall.module.css"

function ChatCallToAction(props) {  

  return (
    <>
      <div className={style["call-to-action"]} onClick={props.onClick}>
        <span className={style["call-to-action__speech-bubble"]}>Olá, vamos conversar?</span>
        <img className={style["call-to-action__img"]} src={DocGuide} alt="Doutora guiando conversa" />
      </div>
    </>
  );
}

export default ChatCallToAction;
