import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import SlideInCss from "./SlideIn.module.css";

type propTypes = {
  trailData: any;
  onClose: (name: string) => void;
};

function SlideIn(props: propTypes) {
  if (!props.trailData) {
    return null;
  } else {
    return (
      <div className={SlideInCss.slideInStyle}>
        <button
          onClick={() => {
            if (props.trailData.name) props.onClose(props.trailData.name);
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h1>{props.trailData.name}</h1>
      </div>
    );
  }
}

export default SlideIn;
