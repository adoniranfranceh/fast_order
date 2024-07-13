import React, { useEffect, useState, createElement } from "react";

function HelloWorld() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        console.log("Hello World")
    }, []);
    const e = createElement;
    return e("div", null, e("h1", null, "Hello World"));

}

export default HelloWorld;