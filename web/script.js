var amount0=0;
var amount1=1;
var P0=0.1;// precio
var P1=10;// Precio de BNB
var oneToken=10;

var buyOrApprove = 0;

var web3;

var address="Conectar";
var swapInstance;


init();
var isConnected = obtenerValorDeLocalStorage("SwapConected");
if(isConnected=="true"){
	connect();
}

async function init() {
    // inyectar proveedor a web3
    // instanciar contratos
    // leer precio P1
    web3 = new Web3(window.ethereum);
    swapInstance = new web3.eth.Contract(exchange_abi, exchange_address);
    P0 = await swapInstance.methods.getAmountByTokenToChange(btk_address, oneToken).call();
    P1 = Number(P0);
    P0 = P1;
    document.getElementById('swap-price-now').innerHTML = P0;
    //alert(P0)
}


async function connect()
{
    //alert("conectar. Obtener address metamask");
    await window.ethereum.request({"method": "eth_requestAccounts", "params": []});
    const account = await web3.eth.getAccounts();

    address = account[0];


    document.getElementById('account').innerHTML=address.toString().slice(0,6)+"...";

    await setBalanceBTK();
    await setBalanceFTK();

    if(buyOrApprove==0) {
      document.getElementById('swap-submit').innerHTML = "Approve";
    }
}


async function handleSubmit() {
    // acá la aprobacion y compra.
    const AmountToBuy = document.querySelector("#form > input.IHAVE").value;

    //swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)

    if(buyOrApprove!=0) {
      swapInstance.methods.swapExactTokensForTokens(AmountToBuy,0,[btk_address,ftk_address],address,1762114086).send({from: address})
          .on('transactionHash', function(hash){
              showToast("transactionHash: "+hash, "orange");
          })
          .on('confirmation', function(confirmationNumber, receipt){
              console.log(confirmationNumber);
          })
          .on('receipt', async function(receipt){
              console.log(receipt);
              showToast("transaccion correcta", "green");
              await setBalanceBTK();
              await setBalanceFTK();
          })      
    } else {
      btkInstance = new web3.eth.Contract(ftk_abi, ftk_address);
      btkInstance.methods.approve(exchange_address,AmountToBuy).send({from: address})
          .on('transactionHash', function(hash){
              showToast("transactionHash: "+hash, "orange");
          })
          .on('confirmation', function(confirmationNumber, receipt){
              console.log(confirmationNumber);
          })
          .on('receipt', async function(receipt){
              console.log(receipt);
              showToast("Transaccion Correcta", "green");
              await allowance();
              if(buyOrApprove==0) {
                document.getElementById('swap-submit').innerHTML = "Approve";
              } else {
                document.getElementById('swap-submit').innerHTML = "Swap";
              }
          }) 
    }

}


async function setBalanceFTK() {
  ftkInstance = new web3.eth.Contract(ftk_abi, ftk_address);
  const balanceFTK = await ftkInstance.methods.balanceOf(address).call();
  document.getElementById("balanceFTK").innerHTML = balanceFTK;
}

async function setBalanceBTK() {
  btkInstance = new web3.eth.Contract(btk_abi, btk_address);
  const balanceBTK = await btkInstance.methods.balanceOf(address).call();
  document.getElementById("balanceBTK").innerHTML = balanceBTK;
}

async function allowance() {
  btkInstance = new web3.eth.Contract(ftk_abi, ftk_address);
  const allowed = await btkInstance.methods.allowance(address,exchange_address).call();
  buyOrApprove = allowed;
}




  /////////////////////////// Funciones comunes

function setValueTokenToSpend() {
	amount0 = document.getElementsByClassName("IHAVE")[0].value;
	amount0 = amount0 / 1;
	amount1 = amount0/P1 ;
	document.getElementsByClassName("IWANT")[0].value=amount1;
}

function showToast(address, color) {
	var toast = document.getElementById("toast");
	var addressLines = address.match(/.{1,20}/g); // Dividir la dirección en grupos de 6 caracteres
  
	toast.innerHTML = ""; // Limpiar el contenido del toast
  
	addressLines.forEach(function(line) {
	  var lineElement = document.createElement("div");
	  lineElement.textContent = line;
	  toast.appendChild(lineElement);
	});
  
	toast.style.backgroundColor = color;
	toast.classList.add("show");
	setTimeout(function(){
	  toast.classList.remove("show");
	}, 3000);
}

// Función para guardar un valor en localStorage
function guardarValorEnLocalStorage(key, valor) {
	localStorage.setItem(key, valor);
}
  
  // Función para obtener un valor de localStorage
function obtenerValorDeLocalStorage(key) {
	const valor = localStorage.getItem(key);
	return valor !== null ? valor : "DE";
}