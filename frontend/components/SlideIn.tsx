import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import SlideInCss from "./SlideIn.module.css";

type propTypes = {
  trailName: string | null;
  onClose: (name: string) => void;
};

function SlideIn(props: propTypes) {
  if (!props.trailName) {
    return null;
  } else {
    return (
      <div className={SlideInCss.slideInStyle}>
        <button
          onClick={() => {
            if (props.trailName) props.onClose(props.trailName);
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h1>{props.trailName}</h1>
      </div>
    );
  }
}

export default SlideIn;
