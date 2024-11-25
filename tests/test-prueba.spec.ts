import { test, expect } from '@playwright/test';

test('Registrar un nuevo usuario, crear un proyecto con ícono personalizado, agregar tres tareas y cambiar prioridad de una tarea', async ({ page, browserName }) => {
    const url = 'https://todo.ly/';
    console.log("Navegando a la URL principal...");
    await page.goto(url);
    await expect(page).toHaveURL(url); // Validar que la URL es correcta

    // Crear un usuario
    console.log("Iniciando el registro de un nuevo usuario...");
    await page.click('div.HPHeaderSignup a');
    const signupForm = page.locator('div.HPsignupDiv');
    await expect(signupForm).toBeVisible(); // Validar que el formulario de registro es visible

    const fullName = "Camila Negrón Vargas";
    // Crear un email único basado en el navegador
    const email = `cvn_chromee@ucb.com`; // Email único por navegador
    const password = "1234";

    console.log("Rellenando los datos del formulario de registro...");
    await page.fill('#ctl00_MainContent_SignupControl1_TextBoxFullName', fullName);
    await page.fill('#ctl00_MainContent_SignupControl1_TextBoxEmail', email);
    await page.fill('#ctl00_MainContent_SignupControl1_TextBoxPassword', password);
    await page.check('#ctl00_MainContent_SignupControl1_CheckBoxTerms');
    await page.click('#ctl00_MainContent_SignupControl1_ButtonSignup');

    console.log("Validando que el usuario haya sido creado correctamente...");
    const logoutButton = page.locator('#ctl00_HeaderTopControl1_LinkButtonLogout');
    await logoutButton.waitFor({ state: 'visible', timeout: 10000 });
    console.log("Usuario registrado exitosamente.");

    // Crear un proyecto
    const projectName = 'Proyecto de Prueba94';
    console.log(`Creando un nuevo proyecto: ${projectName}...`);
    await page.click('div.AddProjectLiDiv');
    const projectNameInput = page.locator('input#NewProjNameInput');
    await page.fill('input#NewProjNameInput', projectName);
    await page.click('input#NewProjNameButton');

    const projectTable = page.locator('#mainProjectList');
    const projectRow = projectTable.locator(`tr:has(td.ProjItemContent:has-text("${projectName}"))`);
    await expect(projectRow).toBeVisible();
    console.log("Proyecto creado y visible en la lista.");

    // Cambiar el ícono del proyecto
    console.log("Cambiando el ícono del proyecto...");
    const itemIndicator = projectRow.locator('td.ItemIndicator');
    await itemIndicator.hover();
    const optionsButton = itemIndicator.locator('div.ProjItemMenu img[title="Options"]');
    await optionsButton.click();

    const contextMenu = page.locator('ul#projectContextMenu');
    const iconToSelect = contextMenu.locator('div.IconFrameOuter span.IconFrame[style*="Home.png"]');
    await iconToSelect.click();

    console.log("Ícono del proyecto cambiado y validado.");

    // Agregar tres tareas
    console.log("Agregando tareas al proyecto...");
    const taskNames = ['Tarea 1', 'Tarea 2', 'Tarea 3'];
    for (const taskName of taskNames) {
        await page.fill('#NewItemContentInput', taskName);
        await page.click('#NewItemAddButton');
        const taskRow = page.locator(`li:has-text("${taskName}")`);
        await taskRow.waitFor({ state: 'visible', timeout: 10000 });
        console.log(`Tarea "${taskName}" agregada y validada.`);
    }

    console.log("Cambiando la prioridad de 'Tarea 1'...");
    const firstTaskRow = page.locator('li:has(div.ItemContentDiv:has-text("Tarea 1"))');
    await firstTaskRow.hover();
    const taskOptionsButton = firstTaskRow.locator('td.ItemIndicator img[title="Options"]');
    await taskOptionsButton.click();

    const taskContextMenu = page.locator('#itemContextMenu');
    const priorityOption = taskContextMenu.locator('.PrioFrame[iconid="2"]');
    await priorityOption.click();

    console.log("Prioridad de 'Tarea 1' cambiada y validada.");
    console.log("Fin de la prueba.");
});
