document.addEventListener('DOMContentLoaded', () =>{

    const API_URL = 'http://127.0.0.1:8000';

    const loginContainer = document.getElementById('login-container');
    const mainContent = document.getElementById('main-content');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const tableContainer = document.getElementById('table-container');
    const logoutButton = document.getElementById('logout-button');
    const paginationControls = document.getElementById('pagination-controls');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const filterButton = document.getElementById('filter-button');
    const clearFilterButton = document.getElementById('clear-filter-button');

    let currentPage = 1;
    let currentSortColumn = null;
    let currentSortOrder = 'asc';
    const pageSize = 100;


    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try{
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

            });

            if (response.ok){
                const data = await response.json();
                localStorage.setItem('accessToken', data.access_token);
                showMainContent();
            } else {
                loginError.textContent = 'E-Mail ou senha inválidos.';
            }

        } catch (error){
            loginError.textContent = 'Erro ao conectar com o servidor.';
        }
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('accessToken');
        showLogin();
    });

    filterButton.addEventListener('click', () => {
        currentPage = 1;
        fetchReportData();
    });

    clearFilterButton.addEventListener('click', () => {
        startDateInput.value = '';
        endDateInput.value = '';
        currentSortColumn = null;
        currentSortOrder = 'asc';
        currentPage = 1;
        fetchReportData();
    });

    async function fetchReportData(){
        const token = localStorage.getItem('accessToken');
        if (!token){
            showLogin();
            return;
        }
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        let url = `${API_URL}/metrics/?page=${currentPage}&size=${pageSize}`;

        if (currentSortColumn){
            url += `&sort_by=${currentSortColumn}&sort_order=${currentSortOrder}`;
        }

        if (startDate){
            url += `&start_date=${startDate}`;
        }

        if (endDate){
            url += `&end_date=${endDate}`;
        }


        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok){
                const result = await response.json();
                renderTable(result.data);
                renderPagination(result.total_records);
            } else if (response.status === 401){
                showLogin();
            }
  
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    function renderTable(data) {
        if (data.length === 0) {
            tableContainer.innerHTML = '<p>Nenhum dado encontrado.</p>';
            return;
        }

        const headers = Object.keys(data[0]);
        let tableHTML = '<table><thead><tr>';
        headers.forEach(header => {

            let sortIndicator = '';
            if (header === currentSortColumn) {
                sortIndicator = currentSortOrder === 'asc' ? ' ▲' : ' ▼';
            }
            tableHTML += `<th data-column="${header}">${header}${sortIndicator}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        data.forEach(row => {
            tableHTML += '<tr>';
            headers.forEach(header => tableHTML += `<td>${row[header]}</td>`);
            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table>';
        tableContainer.innerHTML = tableHTML;

        document.querySelectorAll('#table-container th').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.dataset.column;
                if (currentSortColumn === column) {
                    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSortColumn = column;
                    currentSortOrder = 'asc';
                }
                fetchReportData();
            });
        });
    }

    function renderPagination(totalRows){
        const totalPages = Math.ceil(totalRows / pageSize);
        paginationControls.innerHTML = '';

        if (totalPages <= 1) return;

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1){
                currentPage--;
                fetchReportData();
            }
        });

        const pageInput = document.createElement('input');
        pageInput.type = 'number';
        pageInput.value = currentPage;
        pageInput.min = 1;
        pageInput.max = totalPages;
        pageInput.addEventListener('change', () => {
            let newPage = parseInt(pageInput.value);
            if (newPage >= 1 && newPage <= totalPages){
                currentPage = newPage;
                fetchReportData();
            }else {
                pageInput.value = currentPage;
            }
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Próxima';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages){
                currentPage++;
                fetchReportData();
            }
        });

        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = 'Última';
        lastPageButton.disabled = currentPage === totalPages;
        lastPageButton.addEventListener('click', () => {
            currentPage = totalPages;
            fetchReportData();
        });

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

        paginationControls.appendChild(prevButton);
        paginationControls.appendChild(pageInput);
        paginationControls.appendChild(pageInfo);
        paginationControls.appendChild(nextButton);
        paginationControls.appendChild(lastPageButton);
    }

    function showMainContent(){
        loginContainer.style.display = 'none';
        mainContent.style.display = 'block';
        fetchReportData();
    }
    function showLogin(){
        loginContainer.style.display = 'block';
        mainContent.style.display = 'none';
    }

    function initialize(){
        const token = localStorage.getItem('accessToken');
        if (token){
            showMainContent();
        } else {
            showLogin();
        }
    }
    initialize();
});