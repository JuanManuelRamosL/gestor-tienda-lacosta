import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import JsBarcode from "jsbarcode";

const App = () => {
  return (
    <Router>
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#333" }}>
          Gestión de Tienda
        </h1>
        <nav
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "20px",
          }}
        >
          <Link to="/pedidos" style={navLinkStyle}>
            Pedidos
          </Link>
          <Link to="/productos" style={navLinkStyle}>
            Productos
          </Link>
        </nav>
        <Routes>
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/productos" element={<Productos />} />
        </Routes>
      </div>
    </Router>
  );
};

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    quantity: "",
    unit_price: "",
    direccion: "",
    nombre: "",
    email: "",
    producto: "",
  });

  const loadPedidos = async () => {
    try {
      const response = await axios.get(
        "https://tienda-costa-bakend.vercel.app/api/orders"
      );
      setPedidos(response.data);
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
    }
  };

  const generateBarcode = (id) => {
    const canvas = document.getElementById(`barcode-${id}`);
    if (canvas) {
      JsBarcode(canvas, id, { format: "CODE128", width: 2, height: 50 });
    }
  };

  useEffect(() => {
    loadPedidos();
  }, []);

  useEffect(() => {
    // Generar códigos de barras para cada pedido
    pedidos.forEach((pedido) => generateBarcode(pedido.id));
  }, [pedidos]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://tienda-costa-bakend.vercel.app/api/create-order",
        formData
      );
      if (response.status === 200) {
        loadPedidos();
        setFormData({
          title: "",
          quantity: "",
          unit_price: "",
          direccion: "",
          nombre: "",
          email: "",
          producto: "",
        });
      }
    } catch (error) {
      console.error("Error al crear el pedido:", error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete("https://tienda-costa-bakend.vercel.app/api/order", {
        data: { id },
      });
      loadPedidos();
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  return (
    <div>
      <h2 style={{ color: "#4a90e2", fontSize: "18px", marginBottom: "10px" }}>
        Crear Pedido
      </h2>
      <form onSubmit={createOrder} style={formStyle}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Título"
          required
          style={inputStyle}
        />
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Cantidad"
          required
          style={inputStyle}
        />
        <input
          type="number"
          name="unit_price"
          value={formData.unit_price}
          onChange={handleChange}
          placeholder="Precio Unitario"
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Dirección"
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          style={inputStyle}
        />
        <input
          type="producto"
          name="producto"
          value={formData.producto}
          onChange={handleChange}
          placeholder="Producto"
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Crear Pedido
        </button>
      </form>

      <h2 style={{ color: "#333", fontSize: "18px", marginBottom: "10px" }}>
        Lista de Pedidos
      </h2>
      {pedidos.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          No hay pedidos disponibles
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: "0" }}>
          {pedidos.map((pedido) => (
            <li key={pedido.id} style={{ ...orderItemStyle }}>
              <p>
                <strong>Dirección:</strong> {pedido.direccion}
              </p>
              <p>
                <strong>Nombre:</strong> {pedido.nombre}
              </p>
              <p>
                <strong>Email:</strong> {pedido.email}
              </p>
              <p>
                <strong>Producto:</strong> {pedido.producto}
              </p>
              <div>
                <p>
                  <strong>Código QR:</strong>
                </p>
                <QRCodeCanvas
                  value={`${pedido.nombre}, ${pedido.direccion}, ${pedido.telefono}`}
                  size={128}
                />
              </div>
              <div>
                <p>
                  <strong>Código de Barras:</strong>
                </p>
                <canvas id={`barcode-${pedido.id}`} />
              </div>
              <button
                onClick={() => deleteOrder(pedido.id)}
                style={{
                  ...buttonStyle,
                  backgroundColor: "#e74c3c",
                  marginTop: "10px",
                }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  const loadProductos = async () => {
    try {
      const response = await axios.get(
        "https://tienda-costa-bakend.vercel.app/api/products"
      );
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const handleProductChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://tienda-costa-bakend.vercel.app/api/products",
        productData
      );
      loadProductos();
      setProductData({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
      });
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `https://tienda-costa-bakend.vercel.app/api/products/${id}`
      );
      loadProductos();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  return (
    <div>
      <h2 style={{ color: "#4a90e2", fontSize: "18px", marginBottom: "10px" }}>
        Agregar Producto
      </h2>
      <form onSubmit={createProduct} style={formStyle}>
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleProductChange}
          placeholder="Nombre"
          required
          style={inputStyle}
        />
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleProductChange}
          placeholder="Precio"
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="image"
          value={productData.image}
          onChange={handleProductChange}
          placeholder="image"
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="category"
          value={productData.category}
          onChange={handleProductChange}
          placeholder="category"
          required
          style={inputStyle}
        />
        <textarea
          name="description"
          value={productData.description}
          onChange={handleProductChange}
          placeholder="Descripción"
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Agregar Producto
        </button>
      </form>

      <h2 style={{ color: "#333", fontSize: "18px", marginBottom: "10px" }}>
        Lista de Productos
      </h2>
      {productos.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          No hay productos disponibles
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: "0" }}>
          {productos.map((producto) => (
            <li key={producto.id} style={{ ...orderItemStyle }}>
              <p>
                <strong>Nombre:</strong> {producto.name}
              </p>
              <p>
                <strong>Precio:</strong> {producto.price}
              </p>
              <p>
                <strong>Descripción:</strong> {producto.description}
              </p>
              <img
                src={producto.image}
                alt=""
                style={{
                  height: "230px",
                  width: "200px",
                }}
              />
              <button
                onClick={() => deleteProduct(producto.id)}
                style={{
                  ...buttonStyle,
                  backgroundColor: "#e74c3c",
                  marginTop: "10px",
                }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Estilos reutilizables
const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "14px",
};

const buttonStyle = {
  display: "inline-block",
  padding: "10px 15px",
  backgroundColor: "#4a90e2",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold",
  width: "100%",
};

const orderItemStyle = {
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "4px",
  marginBottom: "10px",
};

const formStyle = {
  backgroundColor: "#f8f8f8",
  padding: "20px",
  borderRadius: "4px",
  border: "1px solid #ddd",
  marginBottom: "20px",
};

const navLinkStyle = {
  display: "inline-block",
  padding: "10px 20px",
  color: "#fff",
  backgroundColor: "#4a90e2",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "16px",
  transition: "all 0.3s ease",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
};

const navLinkHoverStyle = {
  backgroundColor: "#357ABD", // Color al pasar el mouse
  transform: "translateY(-2px)",
  boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.2)",
};

export default App;
