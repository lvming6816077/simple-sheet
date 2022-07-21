import { useState, useEffect } from "react";

export interface UseImageProps {
    imgUrl: string;
    crossOrigin?: string;
}

export interface UseImageResults {
    image?: HTMLImageElement;
    width: number;
    height: number;
    status: string;
}

const useImage = ({ imgUrl, crossOrigin }: UseImageProps) => {
    

    const [state, setState] = useState<UseImageResults>(() => ({
        image: undefined,
        status: "loading",
        width: 0,
        height: 0,
    }));

    useEffect(() => {
        if (!imgUrl) return;
        var img = new Image();

        function onload() {
            setState({
                image: img,
                height: img.height,
                width: img.width,
                status: "loaded",
            });
        }
        function onerror() {
            setState((prev) => ({
                ...prev,
                image: undefined,
                status: "failed",
            }));
        }
        img.addEventListener("load", onload);
        img.addEventListener("error", onerror);

        crossOrigin && (img.crossOrigin = crossOrigin);
        img.src = imgUrl;

        return () => {
            img.removeEventListener("load", onload);
            img.removeEventListener("error", onerror);
        };
    }, [imgUrl, crossOrigin]);

    return state;
};

export default useImage;
