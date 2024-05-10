import styles from "./BadgeButton.module.scss";
import sitewideStyles from "../../styles/sitewide.module.scss";

const BadgeButton = ({ badge, badgeIcon }) => {
    return (
        <button className={`${styles.badges}`}>
            {badgeIcon && (
                <img
                    src={`https://storage.googleapis.com/imp-projects-c/nft/assets/${badgeIcon.imgName}.png`}
                    alt={badge}
                    style={{
                        width: `${badgeIcon.width}px`,
                        height: `${badgeIcon.height}px`,
                    }}
                />
            )}
            <span>{badge}</span>
        </button>
    );
};

export default BadgeButton;
