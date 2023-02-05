import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { base64 } from "@firebase/util";
import { Paper, Button, TextField } from "@mui/material";
import { httpsCallable, functions } from "../firebase";
import PictureList from "./PictureList";

function PhotosUploader() {
  const [sku, setSku] = useState("");
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const resizeImage = (imageFile, width, height) => {
    return new Promise((resolve, reject) => {
      // Create a new image element
      const image = new Image();

      // Set the source of the image to the file URL
      image.src = imageFile;
      console.log(image.src);

      // Wait for the image to load
      image.onload = () => {
        console.log("here");
        // Create a canvas element
        const canvas = document.createElement("canvas");

        // Calculate the aspect ratio of the original image
        const aspectRatio = image.width / image.height;

        // Set the width and height of the canvas based on the aspect ratio
        if (width / aspectRatio <= height) {
          canvas.width = width;
          canvas.height = width / aspectRatio;
        } else {
          canvas.width = height * aspectRatio;
          canvas.height = height;
        }
        // Get a 2D context for the canvas
        const ctx = canvas.getContext("2d");

        // Disable image smoothing
        ctx.imageSmoothingEnabled = false;

        // Draw the image onto the canvas, resizing it to the desired dimensions
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Get the base64-encoded version of the resized image
        const resizedImage = canvas
          .toDataURL("image/jpeg")
          .split(";base64,")[1];
        resolve(resizedImage);

        // Resolve the promise with the resized image
      };
    });
  };
  async function processImages(data) {
    const resizedImages = [];
    for (let i = 0; i < data.length; i++) {
      resizedImages.push(await resizeImage(data[i].preview, 2000, 2000));
    }
    return resizedImages;
  }

  async function processFiles() {
    try {
      const base64Strings = await processImages(files);
      const addPhotos = httpsCallable(functions, "addPhotos");

      setSku("");
      setFiles([]);
      for (let i = 0; i < base64Strings.length; i++) {
        const pic = await addPhotos({ sku, images: [base64Strings[i]] });
        console.log(pic);
        try {
          if (pic.data.body.success !== true) {
            alert(sku + " Failed To Upload");
          }
        } catch {
          alert(sku + " Failed To Upload");
        }
      }
      // Use the base64-encoded strings here
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <img
        src={file.preview}
        alt={file.name}
        onClick={() => {
          const newFiles = [...files];
          newFiles.splice(newFiles.indexOf(file), 1);
          setFiles(newFiles);
          if (files.length == 1) {
            setFiles([]);
          }
        }}
      />
    </div>
  ));

  return (
    <div className="max-w-[1300px] flex gap-8 w-full p-7">
      <Paper
        className="p-4 flex-shrink-0 self-start w-96 flex-grow-0 max-w-[95%] overflow-hidden row-span-1 flex flex-col gap-6"
        elevation={1}
      >
        <TextField
          value={sku}
          label="SKU"
          variant="outlined"
          onChange={(e) => {
            setSku(e.target.value);
          }}
        />
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <div className=" h-80 w-full border-slate-400 border-dashed border-4 rounded-md flex items-center justify-center cursor-pointer">
            Drop Files Here
          </div>
        </div>
        <Button
          variant="contained"
          disabled={sku ? false : true}
          onClick={processFiles}
        >
          Upload
        </Button>
      </Paper>
      <PictureList items={files} setItems={setFiles} />
    </div>
  );
}

export default PhotosUploader;
