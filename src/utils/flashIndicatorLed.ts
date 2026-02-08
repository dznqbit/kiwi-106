import classes from "../components/IndicatorLed.module.css";

export const flashIndicatorLed = (indicatorNode: HTMLDivElement) => {
  indicatorNode.classList.add(classes["--active"]);
  setTimeout(() => {
    indicatorNode.classList.remove(classes["--active"]);
  }, 100);
};
