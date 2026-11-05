/**
 * Shared Invoice Modal & Cart Management
 * Usage: Define `sizePrices` object on each page, then call functions from this script
 */

// These variables should be defined on each page:
// const sizePrices = { '25g': 22.00, '50g': 40.00, '100g': 92.00, ... };

let invoiceItems = [];
let selectedInvoiceIndex = null;
let modalSelectedSize = '100g';
let modalSelectedQuantity = 1;
let editingInvoiceIndex = null;

/**
 * Open modal and populate with current page state
 * Expects: modalProductImg, modalProductName, modalSizeSelect, modalQuantity, mainImage, modalProductImg elements
 * Expects: .size-selector .size-btn.active element to detect active size
 * Expects: #quantity or .quantity-input for page-level quantity
 */
function openModal() {
	// Populate product image from page
	const mainImg = document.getElementById('mainImage') || document.getElementById('mainImg');
	if (mainImg) {
		document.getElementById('modalProductImg').src = mainImg.src;
	}

	// Populate size dropdown from sizePrices map
	const sizeSelect = document.getElementById('modalSizeSelect');
	sizeSelect.innerHTML = '';
	Object.keys(sizePrices).forEach(size => {
		const opt = document.createElement('option');
		opt.value = size;
		opt.textContent = `${size} - ₹${sizePrices[size].toFixed(2)}`;
		sizeSelect.appendChild(opt);
	});

	// Detect and set active size button as initial modal size
	const activeBtn = document.querySelector('.size-selector .size-btn.active') || 
	                   document.querySelector('.size-container .active') ||
	                   document.querySelector('.size-option.active');
	if (activeBtn) {
		modalSelectedSize = activeBtn.textContent.trim();
	}
	document.getElementById('modalSizeSelect').value = modalSelectedSize;

	// Try to read page-level quantity and use it as initial modal quantity
	const pageQtyInput = document.getElementById('quantity') || document.querySelector('.quantity-input');
	if (pageQtyInput) {
		const q = parseInt(pageQtyInput.value, 10);
		modalSelectedQuantity = (Number.isInteger(q) && q > 0) ? q : 1;
	} else {
		modalSelectedQuantity = 1;
	}
	document.getElementById('modalQuantity').value = String(modalSelectedQuantity);

	updateModalTotal();
	renderInvoiceTable();
	document.getElementById('orderModal').style.display = 'block';
}

function onModalSizeChange() {
	modalSelectedSize = document.getElementById('modalSizeSelect').value;
	updateModalTotal();
}

function changeModalQuantity(delta) {
	const input = document.getElementById('modalQuantity');
	let val = parseInt(input.value, 10) || 1;
	val += delta;
	if (val < 1) val = 1;
	input.value = val;
	modalSelectedQuantity = val;
	updateModalTotal();
}

function updateModalTotal() {
	const pricePerUnit = sizePrices[modalSelectedSize] || 100.00;
	const elCalc = document.getElementById('modalCalc');
	const total = (pricePerUnit * modalSelectedQuantity).toFixed(2);
	if (elCalc) elCalc.innerText = `₹${pricePerUnit.toFixed(2)} × ${modalSelectedQuantity} = ₹${total}`;
	updateInvoiceGrandTotal();
}

function renderInvoiceTable() {
	const tbody = document.getElementById('invoiceTbody');
	if (!tbody) return;
	tbody.innerHTML = '';
	invoiceItems.forEach((it, idx) => {
		const tr = document.createElement('tr');
		tr.className = 'invoice-row';
		tr.onclick = () => selectInvoiceRow(idx);
		if (selectedInvoiceIndex === idx) tr.classList.add('selected');
		tr.innerHTML = `
			<td class="sr">${idx + 1}</td>
			<td class="img-col"><img src="${it.img}" alt="${it.name}" class="invoice-thumb"></td>
			<td class="product">${it.name} (${it.size})</td>
			<td class="price">₹${it.price.toFixed(2)}</td>
			<td class="qty">${it.qty}</td>
			<td class="subtotal">₹${(it.price * it.qty).toFixed(2)}</td>
		`;
		tbody.appendChild(tr);
	});
	updateInvoiceGrandTotal();
}

function selectInvoiceRow(index) {
	selectedInvoiceIndex = index;
	renderInvoiceTable();
}

function addOrSaveInvoiceItem() {
	const name = document.getElementById('modalProductName').innerText || 'Product';
	const size = modalSelectedSize || '100g';
	const qty = modalSelectedQuantity || parseInt(document.getElementById('modalQuantity').value, 10) || 1;
	const price = sizePrices[size] || 100.00;
	const img = document.getElementById('modalProductImg').src || '';
	const item = { name, size, price, qty, img };
	if (editingInvoiceIndex !== null && editingInvoiceIndex >= 0 && editingInvoiceIndex < invoiceItems.length) {
		invoiceItems[editingInvoiceIndex] = item;
		editingInvoiceIndex = null;
	} else {
		invoiceItems.push(item);
	}
	selectedInvoiceIndex = null;
	renderInvoiceTable();
}

function startEditSelectedInvoice() {
	if (selectedInvoiceIndex === null || invoiceItems[selectedInvoiceIndex] === undefined) {
		alert('Please select a row to edit');
		return;
	}
	const it = invoiceItems[selectedInvoiceIndex];
	modalSelectedSize = it.size;
	document.getElementById('modalSizeSelect').value = modalSelectedSize;
	modalSelectedQuantity = it.qty;
	document.getElementById('modalQuantity').value = it.qty;
	editingInvoiceIndex = selectedInvoiceIndex;
	document.getElementById('addInvoiceBtn').innerText = 'Save Changes';
	updateModalTotal();
}

function removeSelectedInvoice() {
	if (selectedInvoiceIndex === null || invoiceItems[selectedInvoiceIndex] === undefined) {
		alert('Please select a row to remove');
		return;
	}
	if (!confirm('Remove selected item from invoice?')) return;
	invoiceItems.splice(selectedInvoiceIndex, 1);
	selectedInvoiceIndex = null;
	renderInvoiceTable();
}

function updateInvoiceGrandTotal() {
	const el = document.getElementById('invoiceGrandTotal');
	if (!el) return;
	const total = invoiceItems.reduce((s, it) => s + (it.price * it.qty), 0).toFixed(2);
	el.innerText = total;
	if (editingInvoiceIndex === null) {
		const addBtn = document.getElementById('addInvoiceBtn');
		if (addBtn) addBtn.innerText = 'Add to Invoice';
	}
}

function closeModal() {
	document.getElementById('orderModal').style.display = 'none';
}

function handleSubmitOrder() {
	const name = document.getElementById('customerName').value.trim();
	const contact = document.getElementById('contactNo').value.trim();
	const address = document.getElementById('address').value.trim();
	const pincode = document.getElementById('pincode').value.trim();

	if (!name || !contact || !address || !pincode) {
		alert('Please fill all fields');
		return;
	}

	if (invoiceItems.length === 0) {
		alert('Please add at least one item to invoice');
		return;
	}

	let orderMessage = `CUSTOMER DETAILS:\nName: ${name}\nContact: ${contact}\nAddress: ${address}\nPincode: ${pincode}\n`;
	orderMessage += '\nINVOICE DETAILS:\n';
	orderMessage += 'Sr. | Product | Size | Price | Qty | Subtotal\n';
	orderMessage += '=======================================\n';
	let grandTotal = 0;
	invoiceItems.forEach((it, idx) => {
		const subtotal = (it.price * it.qty).toFixed(2);
		orderMessage += `${idx + 1} | ${it.name} | ${it.size} | ₹${it.price.toFixed(2)} | ${it.qty} | ₹${subtotal}\n`;
		grandTotal += parseFloat(subtotal);
	});
	orderMessage += '=======================================\n';
	orderMessage += `GRAND TOTAL: ₹${grandTotal.toFixed(2)}`;

	const whatsappUrl = 'https://wa.me/918693006186?text=' + encodeURIComponent(orderMessage);
	window.open(whatsappUrl, '_blank');

	const emailSubject = encodeURIComponent('New Order: Zaikajaroori');
	const emailBody = encodeURIComponent(orderMessage);
	const emailUrl = `mailto:hello@zaikajaroori.com?subject=${emailSubject}&body=${emailBody}`;
	window.open(emailUrl);

	closeModal();
}

// Attach Buy Now click handler on page load
document.addEventListener('DOMContentLoaded', function () {
	const buyBtn = document.getElementById('buyNowBtn');
	if (buyBtn && typeof openModal === 'function') {
		buyBtn.addEventListener('click', function (e) {
			e.preventDefault();
			openModal();
		});
	}
});
