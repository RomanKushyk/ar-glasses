import "./errors-dropdown.scss";

import { FC } from "react";
import cn from "classnames";

interface Props {
  errors: string[];
}

export const ErrorsDropdown: FC<Props> = ({ errors }) => {
  return (
    <div
      className={cn("errors-dropdown", {
        "errors-dropdown_active": errors.length,
      })}
    >
      {!!errors.length && (
        <>
          <h3 className="errors-dropdown__title">
            {errors.length <= 1 ? "An error" : "Errors"} occurred:
          </h3>
          <ul className="errors-dropdown__list">
            {errors.map((message) => (
              <li key={message} className="errors-dropdown__item">
                {message}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
