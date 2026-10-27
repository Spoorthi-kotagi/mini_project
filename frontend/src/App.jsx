import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  IconButton,
  Badge,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import axios from "axios";

const API_URL = "http://localhost:5000";

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [open, setOpen] = useState(false);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      const foundProduct = response.data.find((item) => item.product_id === 1);
      setProduct(foundProduct || null);
    } catch (error) {
      setMessage("Could not load products. Check that the backend is running.");
      setSeverity("error");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleAddToCart = () => {
    if (!product || product.stock_quantity <= 0) {
      setMessage("Sorry, this product is out of stock!");
      setSeverity("error");
    } else {
      setCartCount((count) => count + 1);
      setMessage("Added to cart! Stock is checked again when you place the order.");
      setSeverity("success");
    }

    setOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      <AppBar position="static" sx={{ bgcolor: "#172554" }}>
        <Toolbar>
          <ShoppingBagIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            eCart
          </Typography>
          <IconButton color="inherit" aria-label="Shopping cart">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: "#172554", mb: 1 }}
          >
            Welcome to eCart
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover products. Shop smarter.
          </Typography>
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 3, color: "#172554" }}
        >
          Featured Products
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : product ? (
          <Card
            sx={{
              maxWidth: 360,
              borderRadius: 3,
              boxShadow: 3,
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              height="220"
              image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
              alt="Smart Watch"
            />

            <CardContent sx={{ p: 3 }}>
              <Chip
                label={product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                color={product.stock_quantity > 0 ? "success" : "error"}
                size="small"
                sx={{ mb: 2 }}
              />

              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                {product.product_name}
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {product.description}
              </Typography>

              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#172554", mb: 2 }}
              >
                ₹{Number(product.price).toLocaleString("en-IN")}
              </Typography>

              <Typography sx={{ mb: 2 }}>
                Available stock: {product.stock_quantity}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{
                  py: 1.2,
                  bgcolor: "#172554",
                  "&:hover": { bgcolor: "#1e40af" },
                }}
              >
                Add to Cart
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={fetchProduct}
                sx={{ mt: 1 }}
              >
                Refresh Stock
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Alert severity="warning">No product was found.</Alert>
        )}

        <Box sx={{ mt: 6, p: 3, bgcolor: "#e0e7ff", borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Inventory Concurrency Demo
          </Typography>
          <Typography>
            Add the product to your cart, then place an order. The backend
            checks and locks inventory during checkout to prevent overselling.
            Refresh stock to see the latest database quantity.
          </Typography>
        </Box>
      </Container>

      <Snackbar
        open={open}
        autoHideDuration={3500}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;