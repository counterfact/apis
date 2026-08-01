# Ordergroove simulator

This package combines the Customers, Items, Offers, Orders, Products, and
Subscriptions APIs in one Counterfact server. Counterfact derives a URL prefix
from each API group, so paths include both the group and the path declared in
the specification; for example, Customers is served at `/customers/customers`
and Products at `/products/products`.

The contracts in `openapi/upstream/` are the original published documents.
The runtime copies in `openapi/` only remove trailing slashes from path keys so
Counterfact generates loadable route filenames.
