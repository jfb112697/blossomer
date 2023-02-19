# What is Blossomer

Blossomer is a project created to manage the onboarding process of a brick-and-mortar store in Nyack, NY named Squash Blossom onto a Shopify instance.

## UI's

### Login

<img width="1440" alt="image" src="https://user-images.githubusercontent.com/1462292/219971900-61a32e00-4baa-4c7c-9645-1b7e738896fd.png">


### Product onboarding and SKUing

Blossomer includes a form for intaking products, automatically assigns them a SKU, creates a corresponding Shopify product and prints a DYMO label

<img width="1440" alt="image" src="https://user-images.githubusercontent.com/1462292/219972011-d115997b-b37d-43fb-9c18-3fd28bed9b0c.png">


### Editing existing products

A SKU can be entered into the form on the bottom right to begin editing an existing product, a query to the GraphQL API is made and populates the form, allowing the user to submit the form and edit the product

<img width="1440" alt="image" src="https://user-images.githubusercontent.com/1462292/219972078-d1d6a325-a49c-4899-bf75-742643d61979.png">


### Uploading Photos

Blossomer hanldes uploading photos to Shopify by allowed the user to drag and drop photos which are then shown on the page, the user can then drag and drop the individual photos to change their order or remove a photo by clicking on it. The user can submit the photos by entering a SKU and clicking upload. This works well for my use-case because I start each photographing each product by taking a picture of the SKU on the label; meaning I can import all photos of a product, use the first photo to get the SKU, than remove it before uploading to Shopify. Blossomer then uses canvas to re-size the photos to the maximum size allowed by Shopify (20MP) while preserving aspect ratio.

<img width="1440" alt="image" src="https://user-images.githubusercontent.com/1462292/219972253-c57200c1-29bb-49f5-9f06-769963875292.png">

<img width="1440" alt="image" src="https://user-images.githubusercontent.com/1462292/219972373-5e5f25ba-117d-4f32-a264-0331a25a3ece.png">


## Design Goals

Blossomer was designed for maximum efficency in data entry and touch time for a given product. As many steps as possible are consolidated into as little as possible. As a performant single page application Blossomer is capable of fully processing around 100 items an hour.
