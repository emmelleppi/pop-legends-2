import { useEffect, useState, useMemo } from "react";
import * as THREE from "three";

export const WIDTH = 400
export const HEIGHT = WIDTH

const _color = new THREE.Color();

function useImage(url) {
    const [imageData, setImageData] = useState([]);
    const [columns, setColumns] = useState(1);
    const [rows, setRows] = useState(1);
  
    useEffect(() => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
  
      img.onload = function() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
  
        const imageData = ctx.getImageData(0, 0, canvas.width , canvas.height );
  
        setImageData(imageData.data);
        setColumns(parseInt(canvas.width, 10));
        setRows(parseInt(canvas.height, 10));
      };
    }, [url, setImageData]);
  
    const [colors, alpha] = useMemo(() => {
      const color = new Float32Array(imageData.length * 4);
      const alpha = [];
  
      for (let i = 0, j = 0; i < imageData.length; i += 4, j += 1) {
        _color.set(
          `rgb( ${imageData[i]} , ${imageData[i + 1]} , ${imageData[i + 2]})`
        );
        _color.toArray(color, j * 3);
        alpha.push(imageData[i + 3])
      }
      return [color, alpha];
    }, [imageData]);
  
    return { colors, alpha, columns, rows };
  }
  
  export default useImage