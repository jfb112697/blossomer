import { Button } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
function ProductsGrid(props) {
  const rows = props.products;

  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "price", headerName: "Price", width: "50" },
    {
      field: "id",
      width: "75",
      headerName: "Link",

      renderCell: (value) => (
        <a
          href={`https://squash-blossom-a2c1.myshopify.com/admin/products/${value.id}`}
          target="_blank"
        >
          <Button variant="contained">Open</Button>
        </a>
      ),
    },
    {
      field: "label",
      width: "75",
      headerName: "Print Label",
      //test this
      renderCell: (value) => {
        console.log(value);
        return (
          <Button
            variant="contained"
            onClick={() =>
              props.printLabel({
                sku: value.row.sku,
                price: value.row.price,
                printer: props.printer,
              })
            }
          >
            Print
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <DataGrid className="w-full" rows={rows} columns={columns}></DataGrid>
    </>
  );
}

export default ProductsGrid;
