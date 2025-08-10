document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const inputType = document.getElementById('input-type');
    const inputLabel = document.getElementById('input-label');
    const placeholder = document.getElementById('placeholder');
    const required = document.getElementById('required');
    const disabled = document.getElementById('disabled');
    const addIcon = document.getElementById('icon');
    const borderRadius = document.getElementById('border-radius');
    const textColor = document.getElementById('text-color');
    const bgColor = document.getElementById('bg-color');
    const borderColor = document.getElementById('border-color');
    const focusColor = document.getElementById('focus-color');
    const resetBtn = document.getElementById('reset-btn');
    const generateBtn = document.getElementById('generate-btn');
    const previewInput = document.getElementById('preview-input');
    const previewForm = document.querySelector('.preview-form');
    const htmlCode = document.getElementById('html-code');
    const cssCode = document.getElementById('css-code');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');

    // Sample options for select, radio, and checkbox inputs
    const sampleOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
    ];

    // Initialize the app
    function init() {
        updatePreview();
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Input customization controls
        const controls = [inputType, inputLabel, placeholder, required, disabled, addIcon, 
                        borderRadius, textColor, bgColor, borderColor, focusColor];
        
        controls.forEach(control => {
            control.addEventListener('input', updatePreview);
            control.addEventListener('change', updatePreview);
        });

        // Reset button
        resetBtn.addEventListener('click', resetControls);

        // Generate button
        generateBtn.addEventListener('click', generateCode);

        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', switchTab);
        });

        // Copy buttons
        copyButtons.forEach(btn => {
            btn.addEventListener('click', copyToClipboard);
        });
    }

    // Update the preview based on current settings
    function updatePreview() {
        const type = inputType.value;
        const labelText = inputLabel.value || 'Label';
        const placeholderText = placeholder.value || '';
        const isRequired = required.checked;
        const isDisabled = disabled.checked;
        const hasIcon = addIcon.checked;
        const radius = borderRadius.value + 'px';
        const txtColor = textColor.value;
        const bg = bgColor.value;
        const border = borderColor.value;
        const focus = focusColor.value;

        // Update the preview input
        let inputHtml = '';
        let labelHtml = `<label for="preview-input">${labelText}</label>`;

        if (type === 'radio') {
            inputHtml = `<div class="radio-group">`;
            sampleOptions.forEach((option, index) => {
                inputHtml += `
                    <div class="radio-option">
                        <input type="radio" id="radio-${index}" name="radio-group" 
                            ${isDisabled ? 'disabled' : ''} ${isRequired ? 'required' : ''}>
                        <label for="radio-${index}">${option.label}</label>
                    </div>
                `;
            });
            inputHtml += `</div>`;
        } 
        else if (type === 'checkbox') {
            inputHtml = `<div class="checkbox-group-preview">`;
            sampleOptions.forEach((option, index) => {
                inputHtml += `
                    <div class="checkbox-option">
                        <input type="checkbox" id="checkbox-${index}" 
                            ${isDisabled ? 'disabled' : ''} ${isRequired ? 'required' : ''}>
                        <label for="checkbox-${index}">${option.label}</label>
                    </div>
                `;
            });
            inputHtml += `</div>`;
        } 
        else if (type === 'select') {
            inputHtml = `
                <select id="preview-input" class="input-preview" 
                    ${isDisabled ? 'disabled' : ''} ${isRequired ? 'required' : ''}>
                    <option value="" disabled selected>${placeholderText || 'Select an option'}</option>
                    ${sampleOptions.map(option => 
                        `<option value="${option.value}">${option.label}</option>`
                    ).join('')}
                </select>
            `;
        } 
        else if (type === 'textarea') {
            inputHtml = `
                <textarea id="preview-input" class="input-preview" 
                    placeholder="${placeholderText}" 
                    ${isDisabled ? 'disabled' : ''} ${isRequired ? 'required' : ''}
                ></textarea>
            `;
        } 
        else {
            let inputElement = `
                <input type="${type}" id="preview-input" class="input-preview" 
                    placeholder="${placeholderText}" 
                    ${isDisabled ? 'disabled' : ''} ${isRequired ? 'required' : ''}>
            `;

            if (hasIcon) {
                const icon = type === 'password' ? 'fa-lock' : 
                            type === 'email' ? 'fa-envelope' : 
                            type === 'number' ? 'fa-hashtag' : 
                            type === 'tel' ? 'fa-phone' : 
                            type === 'date' ? 'fa-calendar' : 
                            type === 'time' ? 'fa-clock' : 'fa-user';
                
                inputElement = `
                    <div class="input-icon">
                        <i class="fas ${icon}"></i>
                        ${inputElement}
                    </div>
                `;
            }

            inputHtml = inputElement;
        }

        // Update the preview form
        previewForm.innerHTML = `
            <div class="form-row">
                ${labelHtml}
                ${inputHtml}
            </div>
        `;

        // Apply styles to the preview input
        const input = document.getElementById('preview-input') || 
                        document.querySelector('.input-preview') || 
                        document.querySelector('.radio-group input') || 
                        document.querySelector('.checkbox-group-preview input');

        if (input) {
            const inputs = document.querySelectorAll('.input-preview, .radio-group input, .checkbox-group-preview input, select.input-preview, textarea.input-preview');
            
            inputs.forEach(inp => {
                inp.style.borderRadius = radius;
                inp.style.color = txtColor;
                inp.style.backgroundColor = bg;
                inp.style.borderColor = border;
            });

            // For non-radio/checkbox inputs, add focus style
            if (type !== 'radio' && type !== 'checkbox') {
                const style = document.createElement('style');
                style.id = 'dynamic-styles';
                style.textContent = `
                    .input-preview:focus {
                        border-color: ${focus} !important;
                        box-shadow: 0 0 0 2px ${hexToRgba(focus, 0.2)} !important;
                    }
                `;
                
                // Remove old style if exists
                const oldStyle = document.getElementById('dynamic-styles');
                if (oldStyle) {
                    oldStyle.remove();
                }
                
                document.head.appendChild(style);
            }
        }

        // Generate code preview
        generateCodePreview();
    }

    // Generate HTML and CSS code preview
    function generateCodePreview() {
        const type = inputType.value;
        const labelText = inputLabel.value || 'Label';
        const placeholderText = placeholder.value || '';
        const isRequired = required.checked;
        const isDisabled = disabled.checked;
        const hasIcon = addIcon.checked;
        const radius = borderRadius.value + 'px';
        const txtColor = textColor.value;
        const bg = bgColor.value;
        const border = borderColor.value;
        const focus = focusColor.value;

        // Generate HTML code
        let html = '';
        let css = '';

        if (type === 'radio') {
            html = `<div class="form-group">\n    <label>${labelText}</label>\n    <div class="radio-group">`;
            sampleOptions.forEach((option, index) => {
                html += `\n        <div class="radio-option">\n            <input type="radio" id="radio-${index}" name="radio-group" ${isRequired ? 'required' : ''}${isDisabled ? ' disabled' : ''}>\n            <label for="radio-${index}">${option.label}</label>\n        </div>`;
            });
            html += `\n    </div>\n</div>`;

            css = `.radio-group {
display: flex;
gap: 15px;
margin-top: 8px;
}

.radio-option {
display: flex;
align-items: center;
gap: 5px;
}

.radio-option input[type="radio"] {
accent-color: ${focus};
width: 16px;
height: 16px;
}`;
        } 
        else if (type === 'checkbox') {
            html = `<div class="form-group">\n    <label>${labelText}</label>\n    <div class="checkbox-group">`;
            sampleOptions.forEach((option, index) => {
                html += `\n        <div class="checkbox-option">\n            <input type="checkbox" id="checkbox-${index}" ${isRequired ? 'required' : ''}${isDisabled ? ' disabled' : ''}>\n            <label for="checkbox-${index}">${option.label}</label>\n        </div>`;
            });
            html += `\n    </div>\n</div>`;

            css = `.checkbox-group {
display: flex;
gap: 15px;
margin-top: 8px;
}

.checkbox-option {
display: flex;
align-items: center;
gap: 5px;
}

.checkbox-option input[type="checkbox"] {
accent-color: ${focus};
width: 16px;
height: 16px;
}`;
        } 
        else if (type === 'select') {
            html = `<div class="form-group">\n    <label for="custom-select">${labelText}</label>\n    <select id="custom-select" class="custom-input" ${isRequired ? 'required' : ''}${isDisabled ? ' disabled' : ''}>\n        <option value="" disabled selected>${placeholderText || 'Select an option'}</option>`;
            sampleOptions.forEach(option => {
                html += `\n        <option value="${option.value}">${option.label}</option>`;
            });
            html += `\n    </select>\n</div>`;

            css = `.custom-input {
width: 100%;
padding: 12px 15px;
border: 1px solid ${border};
border-radius: ${radius};
font-size: 1rem;
color: ${txtColor};
background-color: ${bg};
transition: all 0.3s ease;
appearance: none;
background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
background-repeat: no-repeat;
background-position: right 10px center;
background-size: 1em;
}

.custom-input:focus {
outline: none;
border-color: ${focus};
box-shadow: 0 0 0 2px ${hexToRgba(focus, 0.2)};
}`;
        } 
        else if (type === 'textarea') {
            html = `<div class="form-group">\n    <label for="custom-textarea">${labelText}</label>\n    <textarea id="custom-textarea" class="custom-input" placeholder="${placeholderText}" ${isRequired ? 'required' : ''}${isDisabled ? ' disabled' : ''}></textarea>\n</div>`;

            css = `.custom-input {
width: 100%;
padding: 12px 15px;
border: 1px solid ${border};
border-radius: ${radius};
font-size: 1rem;
color: ${txtColor};
background-color: ${bg};
transition: all 0.3s ease;
min-height: 100px;
resize: vertical;
}

.custom-input:focus {
outline: none;
border-color: ${focus};
box-shadow: 0 0 0 2px ${hexToRgba(focus, 0.2)};
}`;
        } 
        else {
            let inputHtml = '';
            let iconCss = '';

            if (hasIcon) {
                const icon = type === 'password' ? 'fa-lock' : 
                                type === 'email' ? 'fa-envelope' : 
                                type === 'number' ? 'fa-hashtag' : 
                                type === 'tel' ? 'fa-phone' : 
                                type === 'date' ? 'fa-calendar' : 
                                type === 'time' ? 'fa-clock' : 'fa-user';

                inputHtml = `<div class="input-icon">\n    <i class="fas ${icon}"></i>\n    <input type="${type}" id="custom-input" class="custom-input" placeholder="${placeholderText}" ${isRequired ? 'required' : ''}${isDisabled ? ' disabled' : ''}>\n</div>`;

                iconCss = `.input-icon {
position: relative;
}

.input-icon i {
position: absolute;
left: 10px;
top: 50%;
transform: translateY(-50%);
color: #6c757d;
}

.input-icon .custom-input {
padding-left: 35px;
}`;
            } else {
                inputHtml = `<input type="${type}" id="custom-input" class="custom-input" placeholder="${placeholderText}" ${isRequired ? 'required' : ''}${isDisabled ? ' disabled' : ''}>`;
            }

            html = `<div class="form-group">\n    <label for="custom-input">${labelText}</label>\n    ${inputHtml}\n</div>`;

            css = `.custom-input {
width: 100%;
padding: 12px 15px;
border: 1px solid ${border};
border-radius: ${radius};
font-size: 1rem;
color: ${txtColor};
background-color: ${bg};
transition: all 0.3s ease;
}

.custom-input:focus {
outline: none;
border-color: ${focus};
box-shadow: 0 0 0 2px ${hexToRgba(focus, 0.2)};
}

${iconCss}`;
        }

        // Update code panels
        htmlCode.innerHTML = highlightSyntax(html, 'html');
        cssCode.innerHTML = highlightSyntax(css, 'css');
    }

    // Generate final code
    function generateCode() {
        generateCodePreview();
        switchTab({ currentTarget: document.querySelector('.tab[data-tab="html"]') });
        showToast('Code generated! Switch between tabs to view HTML/CSS.');
    }

    // Reset all controls to default
    function resetControls() {
        inputType.value = 'text';
        inputLabel.value = 'Username';
        placeholder.value = 'Enter your username';
        required.checked = true;
        disabled.checked = false;
        addIcon.checked = false;
        borderRadius.value = 8;
        textColor.value = '#1a1a2e';
        bgColor.value = '#ffffff';
        borderColor.value = '#dddddd';
        focusColor.value = '#4361ee';

        updatePreview();
        showToast('Controls reset to default values');
    }

    // Switch between tabs
    function switchTab(e) {
        const tab = e.currentTarget;
        const tabId = tab.getAttribute('data-tab');

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            }
        });
    }

    // Copy code to clipboard
    function copyToClipboard(e) {
        const targetId = e.currentTarget.getAttribute('data-target');
        const codeElement = document.getElementById(targetId);
        const text = codeElement.textContent;

        navigator.clipboard.writeText(text).then(() => {
            showToast('Code copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    // Show toast notification
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Helper function to convert hex to rgba
    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Simple syntax highlighting
    function highlightSyntax(code, language) {
        if (language === 'html') {
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"(.*?)"/g, '&quot;<span class="code-value">$1</span>&quot;')
                .replace(/\b(class|id|for|type|placeholder|required|disabled)\b/g, '<span class="code-attr">$1</span>')
                .replace(/\b(div|label|input|select|option|textarea)\b/g, '<span class="code-tag">&lt;$1&gt;</span>');
        } else if (language === 'css') {
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/([^{}]+)(?={)/g, '<span class="code-selector">$1</span>')
                .replace(/([a-zA-Z-]+)(?=:)/g, '<span class="code-property">$1</span>')
                .replace(/(:)(.*?)(?=;)/g, '$1<span class="code-value">$2</span>');
        }
        return code;
    }

    // Initialize the app
    init();
});