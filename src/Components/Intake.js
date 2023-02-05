import {
  Paper,
  TextareaAutosize,
  Typography,
  Input,
  FormControl,
  FormHelperText,
  InputLabel,
  Button,
  TextField,
  FormLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, functions, httpsCallable, locationRef } from "../firebase";
import { useEffect, useState, useRef } from "react";
import ProductsGrid from "./ProductsGrid";
import { useGetPrinters, printLabel } from "../Hooks/useDymo";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { skuRef, firestore } from "../firebase";
import FirestoreDocument from "./FirestoreDocument";

import CurrencyInput from "./CurrencyInput";
import { gridDateTimeFormatter } from "@mui/x-data-grid";
function Intake() {
  const titleRef = useRef(null);

  const isComponentMounted = useRef(true);
  const [skuValue, skuLoading, skuError] = useDocument(skuRef, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [querySku, setQuerySku] = useState("");
  const [queryProduct, setQueryProduct] = useState({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [itemType, setItemType] = useState("");
  const [artist, setArtist] = useState("");
  const [products, setProducts] = useState([]);
  const [location, setLocation] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { data, loadingPrinters, printerError } = useGetPrinters(
    isComponentMounted,
    []
  );
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const states = [title, desc, price, itemType, artist, location];

  console.log(selectedPrinter);

  async function handleUpdate() {
    const getProductBySku = httpsCallable(functions, "getProductBySku");
    try {
      const product = await getProductBySku({ sku: querySku });
      product.data.id = product.data.id.split("/").slice(-1);
      setQueryProduct({ id: product.data.id });
      setTitle(product.data.title);
      setDesc(product.data.bodyHtml);
      setPrice(product.data.variants.edges[0].node.price);
      setItemType(product.data.productType);
      titleRef.current.focus();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit() {
    const tags = artist ? "artist:" + artist : "";

    if (queryProduct.id) {
      const updateProduct = httpsCallable(functions, "updateProduct");
      const result = await updateProduct({
        product: {
          id: queryProduct.id,
          body_html: desc,
          title: title,
          productType: itemType,
          tags: tags,
          variants: [
            {
              price: price,
              sku: querySku,
            },
          ],
        },
      });
      setProducts([
        ...products,
        {
          title: result.data.title,
          price: result.data.variants[0].price,
          url: `https://squash-blossom-a2c1.myshopify.com/admin/products/${result.data.id}`,
          id: result.data.id,
          sku: querySku,
        },
      ]);
      setQueryProduct({});
      setQuerySku("");
      setTitle("");
      setDesc("");
      setPrice("");
      setItemType("");
      setArtist("");
      setLocation("");
      titleRef.current.focus();
    } else {
      const createProduct = httpsCallable(functions, "newProduct");
      const sku = skuValue.data().value;
      console.log(sku);
      const result = await createProduct({
        title: title,
        body_html: desc,
        product_type: itemType,
        tags: tags,
        published_at: null,
        variants: [
          {
            price: price,
            sku: sku,
            inventory_quantity: 1,
            inventory_management: "shopify",
            inventory_policy: "deny",
            barcode: sku,
          },
        ],
        productType: itemType,
      });
      console.log("setProducts");
      setProducts([
        ...products,
        {
          title: result.data.title,
          price: result.data.variants[0].price,
          url: `https://squash-blossom-a2c1.myshopify.com/admin/products/${result.data.id}`,
          id: result.data.id,
          sku: sku,
        },
      ]);
      console.log(selectedPrinter);
      await printLabel({
        printer: selectedPrinter,
        price: price,
        sku: sku,
      });
      await updateDoc(skuRef, { value: sku + 1 });
      await addDoc(locationRef, { sku: sku, location: location });
    }
    setTitle("");
    setDesc("");
    setPrice("");
    setItemType("");
    setArtist("");
    titleRef.current.focus();
  }

  //useEffect on printers.data, setSelectedPrinter(printers.data[0](or whatever));
  return (
    <div className="flex justify-center w-full h-full">
      <div className="grid gap-7 grid-cols-1 grid-rows-1 md:grid-rows:3 md:grid-cols-2 p-7 justify-around h-[100%] w-full md:max-w-7xl">
        <Paper
          className="p-4 h-auto overflow-hidden flex flex-col md:col-span-1 md:row-span-3"
          elevation={1}
        >
          <Typography>Item Details</Typography>
          <FormControl className="w-full" on>
            <div className="flex flex-col gap-8 p-4">
              <TextField
                id="item-title"
                inputRef={titleRef}
                value={title}
                onInput={(e) => setTitle(e.target.value)}
                label="Item Title"
                required
                variant="filled"
              ></TextField>
              <TextField
                aria-label="minimum height"
                multiline
                minRows={4}
                label="Item Description"
                value={desc}
                onInput={(e) => setDesc(e.target.value)}
                variant="outlined"
              />
              <CurrencyInput price={price} setPrice={setPrice} />
              <TextField
                onInput={(e) => setItemType(e.target.value)}
                value={itemType}
                id="item-type"
                label="Item Type"
                variant="outlined"
              ></TextField>
              <TextField
                onInput={(e) => setArtist(e.target.value)}
                value={artist}
                id="artist"
                label="Artist"
                variant="outlined"
              ></TextField>
              <TextField
                onInput={(e) => setLocation(e.target.value)}
                value={location}
                id="location"
                label="Item Location"
                variant="outlined"
              ></TextField>
              {queryProduct.id ? (
                <TextField
                  id="sku"
                  value={querySku}
                  variant="outlined"
                  onInput={(e) => setQuerySku(e.target.value)}
                  label="SKU"
                />
              ) : (
                <></>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={skuValue ? buttonDisabled : true}
                onClick={handleSubmit}
              >
                {skuValue
                  ? queryProduct.id
                    ? "Update Product"
                    : "Create Product"
                  : "Can't Fetch SKU"}
              </Button>
            </div>
          </FormControl>
        </Paper>
        <Paper className="p-4 flex items-center justify-between flex-wrap overflow-hidden flex-col">
          <ProductsGrid
            products={products}
            printer={selectedPrinter}
            printLabel={printLabel}
          />
        </Paper>
        <Paper className="p-4 flex flex-col items-between gap-4 ">
          <h3>Select a Printer</h3>
          {loadingPrinters ? (
            <h4>Loading...</h4>
          ) : (
            <FormControl fullWidth>
              <InputLabel id="printer-select-label">
                Select A Printer
              </InputLabel>
              <Select
                labelId="printer-select-label"
                key="Connected Printers"
                value={selectedPrinter}
                label="Connected Printers"
                onChange={(e) => setSelectedPrinter(e.target.value)}
                s
              >
                {data.map((p) => {
                  return (
                    <MenuItem key={Math.random() * 10} value={p} selected>
                      {p}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
        </Paper>
        <Paper className="p-3 flex flex-col gap-4 content-center">
          <h2>Update Product</h2>
          <FormControl className="flex w-full gap-1 !flex-row">
            <TextField
              label="Enter SKU"
              value={querySku}
              onChange={(e) => setQuerySku(e.target.value)}
              className="flex-grow"
            />
            <Button
              variant="contained"
              color={queryProduct.id ? "error" : "primary"}
              onClick={
                queryProduct.id
                  ? (e) => {
                      setQueryProduct({});
                      setQuerySku("");
                      setTitle("");
                      setDesc("");
                      setPrice("");
                      setItemType("");
                      setArtist("");
                      setLocation("");
                      titleRef.current.focus();
                    }
                  : handleUpdate
              }
            >
              {queryProduct.id ? "Stop Editing" : "Edit Product"}
            </Button>
          </FormControl>
        </Paper>
      </div>
    </div>
  );
}

export default Intake;
