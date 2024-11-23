
const simulatedUsers = [
        { name: "Admin", email: "admin@bluevelvet.com", password: "admin123", role: "admin" },
        { name: "John Doe", email: "john@bluevelvet.com", password: "john1234", role: "salesmanager" },
        { name: "Jane Smith", email: "jane@bluevelvet.com", password: "jane1234", role: "editor" },
];


localStorage.setItem('users', JSON.stringify(simulatedUsers));
console.log("bd iniciado-usuários!");

// Lista inicial de produtos
const initialProducts = [
    {
      id: 1,
      name: "Guided by Voices - Bee Thousand",
      shortDescription: "Classic indie rock album.",
      fullDescription: "Bee Thousand is one of the most acclaimed indie rock albums, showcasing lo-fi brilliance.",
      brand: "Matador Records",
      category: "CD",
      mainImage: "/static/images/img1.jpg",
      extraImages: [],
      price: 15.99,
      discount: 0,
      activated: true,
      inStock: true,
      dimensions: "5x5x0.5",
      weight: 0.5,
      cost: 7.99,
      details: [
        { name: "Release Year", value: "1994" },
        { name: "Genre", value: "Indie Rock" },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Pavement - Slanted and Enchanted",
      shortDescription: "The debut album by Pavement.",
      fullDescription: "A highly influential album that shaped the indie rock genre in the 90s.",
      brand: "Domino Recording Co",
      category: "MP3",
      mainImage: "/static/images/img2.jpg",
      extraImages: [],
      price: 9.99,
      discount: 10,
      activated: true,
      inStock: true,
      dimensions: "5x5x0.2",
      weight: 0.3,
      cost: 3.99,
      details: [
        { name: "Release Year", value: "1992" },
        { name: "Genre", value: "Indie Rock" },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Neutral Milk Hotel T-Shirt",
      shortDescription: "Band merchandise for fans.",
      fullDescription: "A high-quality cotton t-shirt featuring artwork inspired by Neutral Milk Hotel.",
      brand: "Merge Records",
      category: "T-Shirt",
      mainImage: "/static/images/img3.jpg",
      extraImages: [],
      price: 19.99,
      discount: 5,
      activated: true,
      inStock: true,
      dimensions: "10x8x1",
      weight: 0.7,
      cost: 9.99,
      details: [
        { name: "Material", value: "100% Cotton" },
        { name: "Size", value: "M, L, XL" },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      name: "Indie Rock 101",
      shortDescription: "Essential book for indie rock enthusiasts.",
      fullDescription: "Indie Rock 101 is a comprehensive guide covering the history and impact of indie rock music.",
      brand: "Music Books",
      category: "Book",
      mainImage: "/static/images/img4.jpg",
      extraImages: [],
      price: 24.99,
      discount: 0,
      activated: true,
      inStock: true,
      dimensions: "8x6x1",
      weight: 1.5,
      cost: 14.99,
      details: [
        { name: "Author", value: "Steve Albini" },
        { name: "Pages", value: "320" },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 5,
      name: "The Jesus and Mary Chain Poster",
      shortDescription: "Artistic band poster.",
      fullDescription: "This poster features a stunning design inspired by The Jesus and Mary Chain's aesthetic.",
      brand: "Art & Prints",
      category: "Poster",
      mainImage: "/static/images/img5.jpg",
      extraImages: [],
      price: 12.99,
      discount: 15,
      activated: true,
      inStock: true,
      dimensions: "24x18x0.1",
      weight: 0.2,
      cost: 4.99,
      details: [
        { name: "Material", value: "Glossy Paper" },
        { name: "Dimensions", value: "24x18 inches" },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 6,
      name: "Album XYZ",
      shortDescription: "A classic album for vinyl collectors.",
      fullDescription: "Album XYZ is a must-have for any indie music enthusiast.",
      brand: "Brand 1",
      category: "Vinyl",
      mainImage: "/static/images/img6.jpg",
      extraImages: [],
      price: 29.99,
      discount: 20,
      activated: true,
      inStock: true,
      dimensions: "12x12x0.2",
      weight: 1.2,
      cost: 15.99,
      details: [
        { name: "Release Year", value: "1998" },
        { name: "Format", value: "Vinyl" },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 7,
      name: "Tote Bag",
      shortDescription: "Stylish and practical tote bag.",
      fullDescription: "A durable tote bag with an indie rock-themed design.",
      brand: "Accessories",
      category: "Merchandise",
      mainImage: "/static/images/img7.jpg",
      extraImages: [],
      price: 14.99,
      discount: 10,
      activated: true,
      inStock: true,
      dimensions: "15x12x2",
      weight: 0.8,
      cost: 5.99,
      details: [
        { name: "Material", value: "Canvas" },
        { name: "Color", value: "Natural" },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 8,
      name: "Headphones",
      shortDescription: "High-quality headphones for music lovers.",
      fullDescription: "Experience your favorite indie tracks with exceptional sound quality.",
      brand: "Tech",
      category: "Electronics",
      mainImage: "/static/images/img8.jpg",
      extraImages: [],
      price: 49.99,
      discount: 0,
      activated: true,
      inStock: true,
      dimensions: "6x6x3",
      weight: 1.5,
      cost: 25.99,
      details: [
        { name: "Type", value: "Over-Ear" },
        { name: "Connectivity", value: "Wireless" },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 9,
      name: "Guitar Picks",
      shortDescription: "Set of 5 premium guitar picks.",
      fullDescription: "Durable and smooth picks ideal for both strumming and soloing.",
      brand: "Music Accessories",
      category: "Accessories",
      mainImage: "/static/images/img9.jpg",
      extraImages: ["/static/images/img9-extra1.jpg"],
      price: 5.99,
      discount: 0,
      activated: true,
      inStock: true,
      dimensions: "2x1.5x0.1",
      weight: 0.1,
      cost: 1.99,
      details: [
        { name: "Material", value: "Celluloid" },
        { name: "Thickness", value: "0.88mm" },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 10,
      name: "Band Poster",
      shortDescription: "Decorate your space with this band poster.",
      fullDescription: "A minimalist poster featuring indie rock band artwork.",
      brand: "Art & Prints",
      category: "Poster",
      mainImage: "/static/images/img10.jpg",
      extraImages: [],
      price: 9.99,
      discount: 5,
      activated: true,
      inStock: true,
      dimensions: "18x24x0.1",
      weight: 0.2,
      cost: 3.99,
      details: [
        { name: "Material", value: "Matte Paper" },
        { name: "Frame", value: "Not Included" },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  

// Salva o estado inicial em uma chave separada no localStorage
if (!localStorage.getItem('resetProducts')) {
  localStorage.setItem('resetProducts', JSON.stringify(initialProducts));
}

// Inicializa os produtos com base no estado atual ou no inicial
if (!localStorage.getItem('products')) {
  localStorage.setItem('products', JSON.stringify(initialProducts));
}