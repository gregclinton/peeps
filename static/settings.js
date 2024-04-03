settings = {
    toggle: () => {
        e = document.getElementById('settings');
        e.hidden = !e.hidden;
    },

    name: 'gpt-3.5-turbo-0125',

    companies: [
        {
        name: "openai",
        url: "https://openai.com/pricing",
        models: [
            {
            name: "gpt-4-0125-preview",
            context: 128000,
            inPrice: 10,
            outPrice: 30,
            trainingDate: "Dec '23"
            },
            {
            name: "gpt-4",
            context: 8000,
            inPrice: 30,
            outPrice: 60,
            trainingDate: "Sep '21"
            },
            {
            name: "gpt-4-32k",
            context: 32000,
            inPrice: 60,
            outPrice: 120,
            trainingDate: "Sep '21"
            },
            {
            name: "gpt-3.5-turbo-0125",
            context: 4000,
            inPrice: 0.5,
            outPrice: 1.5,
            trainingDate: "Sep '21"
            }
        ]
        },
        {
        name: "anthropic",
        url: "https://anthropic.com/news/claude-3-family",
        models: [
            {
            name: "claude-3-haiku-20240307",
            context: null,
            inPrice: 0.25,
            outPrice: 1.25,
            trainingDate: null
            },
            {
            name: "claude-3-sonnet-20240229",
            context: null,
            inPrice: 3,
            outPrice: 15,
            trainingDate: null
            },
            {
            name: "claude-3-opus-20240229",
            context: null,
            inPrice: 15,
            outPrice: 75,
            trainingDate: null
            }
        ]
        },
        {
        name: "google",
        url: "https://ai.google.dev/models/gemini",
        models: [
            {
            name: "gemini-1.0-pro-001",
            context: 30720,
            inPrice: "free",
            outPrice: 60,
            trainingDate: "Feb '24"
            },
            {
            name: "gemini-1.5-pro-latest",
            context: 1048576,
            inPrice: "free",
            outPrice: 2,
            trainingDate: "Feb '24"
            },
            {
            name: "gemini-nano",
            context: null,
            inPrice: 0.13,
            outPrice: 0.38,
            trainingDate: null
            }
        ]
        },
        {
        name: "mistralai",
        url: "https://docs.mistral.ai/platform/pricing",
        models: [
            {
            name: "mistral-small-latest",
            context: null,
            inPrice: 2,
            outPrice: 6,
            trainingDate: null
            },
            {
            name: "mistral-medium-latest",
            context: null,
            inPrice: 2.7,
            outPrice: 8.1,
            trainingDate: null
            },
            {
            name: "mistral-large-latest",
            context: null,
            inPrice: 8,
            outPrice: 24,
            trainingDate: null
            }
        ]
        }
    ]
}

fetch('/settings/', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({model: 'gpt-3.5-turbo-0125'})
})

window.onload = () => {
    const models = document.getElementById('models');

    settings.companies.forEach(company => {
        const div = document.createElement('div');
        const span = document.createElement('span');

        span.innerHTML = '<h3>' + company.name + '</h3><br/>';
        div.appendChild(span);
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');
        const thead = document.createElement('thead');

        const first = company.models[0];

        thead.innerHTML =
            '<th>model</th>' +
            (first.context ? '<th>context</th>' : '') +
            '<th>in</th><th>out</th>' +
            (first.trainingDate ? '<th>trained</th>' : '');

        div.appendChild(table);
        table.appendChild(thead);
        table.appendChild(tbody);
        div.appendChild(table);

        company.models.forEach(model => {
            const tr = document.createElement('tr');
            const addTd = (value => {
                if (value !== null) {
                    const td = document.createElement('td');

                    if (value > 1000) {
                        value =  Math.round(value / 1000) + 'K';
                    }
                    td.innerHTML = value;
                    tr.appendChild(td)
                }
            });

            addTd(model.name);
            addTd(model.context);
            addTd(model.inPrice);
            addTd(model.outPrice);
            addTd(model.trainingDate);
            tbody.appendChild(tr);
        });

        models.appendChild(div);
    });
};