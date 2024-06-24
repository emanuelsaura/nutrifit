document.addEventListener('DOMContentLoaded', () => {
    const app_id = '1ad8338e';  // Reemplaza con tu App ID de Edamam
    const app_key = 'ac144a9a2e8b1de915c1a432a198fa25';  // Reemplaza con tu App Key de Edamam
    const recipesContainer = document.getElementById('recipes-container');
    const searchForm = document.getElementById('search-form');
    const queryInput = document.getElementById('query');

    const fetchRecipes = async (query) => {
        let apiUrl = `https://api.edamam.com/search?q=${query}&app_id=${app_id}&app_key=${app_key}`;

        // Obtener los valores de los filtros
        const caloriesFrom = document.getElementById('caloriesFrom').value;
        const caloriesTo = document.getElementById('caloriesTo').value;
        const ingredients = document.getElementById('ingredients').value;
        const vegetarian = document.getElementById('vegetarian').checked;
        const vegan = document.getElementById('vegan').checked;
        const gluten = document.getElementById('gluten').checked;
        const dairy = document.getElementById('dairy').checked;

        // Agregar filtros a la URL
        if (caloriesFrom) apiUrl += `&calories=${caloriesFrom}-${caloriesTo}`;
        if (ingredients) apiUrl += `&ingr=${ingredients}`;
        if (vegetarian) apiUrl += `&health=vegetarian`;
        if (vegan) apiUrl += `&health=vegan`;
        if (gluten) apiUrl += `&health=gluten-free`;
        if (dairy) apiUrl += `&health=dairy-free`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Error al buscar recetas');
            }
            const data = await response.json();
            console.log(data);  // Log para depuración
            recipesContainer.innerHTML = '';  // Limpiar resultados anteriores
            if (data.hits.length === 0) {
                recipesContainer.innerHTML = '<p>No se encontraron recetas.</p>';
                return;
            }
            data.hits.forEach(hit => {
                const recipe = hit.recipe;
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('recipe-card');

                recipeCard.innerHTML = `
                    <img src="${recipe.image}" alt="${recipe.label}" class="recipe-image">
                    <h3>${recipe.label}</h3>
                    <p>Calorías: ${Math.round(recipe.calories)}</p>
                    <p>Vegetariano: ${recipe.healthLabels.includes('Vegetarian') ? 'Sí' : 'No'}</p>
                    <p>Vegano: ${recipe.healthLabels.includes('Vegan') ? 'Sí' : 'No'}</p>
                    <a href="${recipe.url}" target="_blank">Ver receta</a>
                `;
                recipesContainer.appendChild(recipeCard);
            });
        } catch (error) {
            console.error('Error fetching the recipes:', error);
            recipesContainer.innerHTML = '<p>Hubo un error al buscar recetas. Por favor, intenta de nuevo más tarde.</p>';
        }
    };

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = queryInput.value;
        fetchRecipes(query);
    });

    queryInput.addEventListener('input', () => {
        const query = queryInput.value;
        if (query.length > 2) {  // Realiza la búsqueda solo si hay más de 2 caracteres
            fetchRecipes(query);
        } else {
            recipesContainer.innerHTML = '';  // Limpiar resultados si la consulta es muy corta o vacía
        }
    });

    document.getElementById('apply-filters').addEventListener('click', () => {
        const query = queryInput.value;
        fetchRecipes(query);
    });

    // No realizar una búsqueda inicial por defecto
    // fetchRecipes('chicken');
});
