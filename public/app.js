const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const limitSelect = document.getElementById('limit');
const categoryOptions = document.getElementById('category-options');
const grid = document.getElementById('grid');
const status = document.getElementById('status');
const pagination = document.getElementById('pagination');
const resultTitle = document.getElementById('result-title');
const resultSubtitle = document.getElementById('result-subtitle');
const categories = ['Analytics','Development','Security','Design'];
let selectedCategories = new Set();
let currentPage = 1;
let debounceTimer;
let requestController;

categories.forEach(category => {
  const label = document.createElement('label');
  label.className = 'category-check';
  label.innerHTML = `<input type="checkbox" value="${category}"><span>${category}</span>`;
  label.querySelector('input').addEventListener('change', e => {
    if (e.target.checked) selectedCategories.add(category); else selectedCategories.delete(category);
    currentPage = 1; fetchCatalog();
  });
  categoryOptions.appendChild(label);
});
function scheduleSearch(){
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { currentPage = 1; fetchCatalog(); }, 350);
}
searchInput.addEventListener('input', scheduleSearch);function renderCards(items){
  if(!items.length){grid.innerHTML='<div class="empty-state"><strong>No matching resources</strong>Try a different keyword or remove a category filter.</div>';return;}
  grid.innerHTML=items.map(item=>`<article class="item-card"><div class="card-top"><span class="category-tag ${item.category.toLowerCase()}">${item.category}</span><span class="rating">★ ${Number(item.rating).toFixed(1)}</span></div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p><div class="card-meta"><span>◷ ${item.durationMinutes} min</span><span class="level-pill">${item.level}</span></div></article>`).join('');
}
function escapeHTML(value){return String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderPagination(meta){
  pagination.innerHTML=''; if(meta.pages<=1)return;
  const addButton=(text,page,disabled=false,active=false)=>{const b=document.createElement('button');b.className='page-btn'+(active?' active':'');b.textContent=text;b.disabled=disabled;b.addEventListener('click',()=>{currentPage=page;fetchCatalog();});pagination.appendChild(b);};
  addButton('‹',meta.page-1,meta.page===1);
  let start=Math.max(1,meta.page-2),end=Math.min(meta.pages,start+4);start=Math.max(1,end-4);
  for(let p=start;p<=end;p++)addButton(String(p),p,false,p===meta.page);
  addButton('›',meta.page+1,meta.page===meta.pages);
}
async function fetchCatalog(){
  if(requestController)requestController.abort();
  requestController=new AbortController();
  grid.innerHTML='<div class="loading">Loading resources…</div>';status.textContent='';pagination.innerHTML='';
  const params=new URLSearchParams({search:searchInput.value.trim(),category:[...selectedCategories].join(','),page:currentPage,limit:limitSelect.value,sort:sortSelect.value});
  try{
    const response=await fetch(`/api/catalog?${params}`,{signal:requestController.signal});
    if(!response.ok)throw new Error('Server returned an error');
    const result=await response.json();
    renderCards(result.data);renderPagination(result.pagination);
    resultTitle.textContent=result.pagination.total+' resources found';
    resultSubtitle.textContent=`Page ${result.pagination.page} of ${result.pagination.pages} · ${result.pagination.total} total results`;
  }catch(error){if(error.name==='AbortError')return;grid.innerHTML='<div class="empty-state"><strong>Could not load catalog</strong>Please check your connection and try again.</div>';resultTitle.textContent='Catalog unavailable';resultSubtitle.textContent='';}
}
sortSelect.addEventListener('change',()=>{currentPage=1;fetchCatalog();});limitSelect.addEventListener('change',()=>{currentPage=1;fetchCatalog();});
document.getElementById('clear').addEventListener('click',()=>{searchInput.value='';selectedCategories.clear();categoryOptions.querySelectorAll('input').forEach(input=>input.checked=false);sortSelect.value='title-asc';limitSelect.value='12';currentPage=1;fetchCatalog();});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();searchInput.focus();}});
fetchCatalog();
