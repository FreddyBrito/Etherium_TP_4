# Trabajo Práctico Módulo 4

**Creación de Front-End y testing para SimpleSwap del Módulo 3**

---

## Demo
[Video](https://youtu.be/6xmnzfVkIFo)

---

## txHash que se muestra en el video
0x9d22390ac569f70b2b94fbbf49db20eac1facc8303d465a3a33e16ccfc363399
[txHash](https://sepolia.etherscan.io/tx/0x9d22390ac569f70b2b94fbbf49db20eac1facc8303d465a3a33e16ccfc363399)

---

## Frontend
**Link SimpleSwap:**
[SimpleSwapWeb](https://freddybrito.github.io/Etherium_TP_4/)

---

## Pruebas Unitarias
**Resultado de covertura:**
[COVERAGE](./coverage.md)

---

## SimpleSwap

**Dirección del contrato:**  
`0x0b873922A90A4d8Ac7FEDf90Bcb7d1B1BD6a7A71`  
[Ver en Etherscan](https://sepolia.etherscan.io/address/0x0b873922A90A4d8Ac7FEDf90Bcb7d1B1BD6a7A71#code)

---

## tokenA (TokenBrito)

**Dirección del token:**  
`0x978110ED33f7c45874CDF13Df4c3D12148FD94A8`  
[Ver en Etherscan](https://sepolia.etherscan.io/address/0x978110ED33f7c45874CDF13Df4c3D12148FD94A8)

---

## tokenB (TokenFreddy)

**Dirección del token:**  
`0x54F291892c6c9be28149e65731d6988A97fb04fd`  
[Ver en Etherscan](https://sepolia.etherscan.io/address/0x54F291892c6c9be28149e65731d6988A97fb04fd)

---

📢 **Requerimientos:**

### 1️⃣ Interacción con el contrato  
Desarrollar un **front-end** que permita interactuar con el contrato de **SimpleSwap** desarrollado para el módulo 3.  
Este front-end debe:
- Conectar una billetera.
- Habilitar las funciones para intercambiar el token A por el token B y viceversa.
- Obtener el precio de un token en función del otro.

### 2️⃣ Entorno de desarrollo y Testing  
Implementar el proyecto utilizando **Hardhat** y realizar el test del contrato, logrando una **cobertura igual o superior al 50%** (npx hardhat coverage).

### 3️⃣ Recomendaciones del instructor  
Si el instructor proporcionó recomendaciones durante la revisión del contrato de SimpleSwap en el módulo 3, **deben ser implementadas** en este trabajo.

### 4️⃣ Herramientas permitidas  
Se puede utilizar **cualquier herramienta** para desarrollar el front-end, como:
- HTML  
- JavaScript  
- React  
- Scaffold-ETH  
- Entre otras.

### 5️⃣ Almacenamiento y despliegue  
- Los programas y contratos utilizados deben ser **almacenados en un repositorio de GitHub** para su evaluación.  
- El front-end debe estar **desplegado** en alguna plataforma como:
  - GitHub Pages  
  - Vercel  
  - Hosting con cPanel  
  - Etc.
