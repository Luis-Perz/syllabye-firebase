import {useState} from "react";

export default function Questions({children, content}){
    const [visible, setVisible] = useState(false);
    return (
        <div
            style={{ position: "relative", display: "inline-block", cursor: "pointer"}}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div className="questions-window">
                    {content}
                </div>
            )}
        </div>
    );
}
