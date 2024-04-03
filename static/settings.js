settings = {
    toggle: () => {
        e = document.getElementById('settings');
        e.hidden = !e.hidden;
    },

    model: 'gpt-3.5-turbo-0125',

    companies: [
        {
        company: "openai",
        url: "https://openai.com/pricing",
        models: [
            {
            model: "gpt-4-0125-preview",
            context: 128000,
            inPrice: 10,
            outPrice: 30,
            trainingDate: "Dec '23"
            },
            {
            model: "gpt-4",
            context: 8000,
            inPrice: 30,
            outPrice: 60,
            trainingDate: "Sep '21"
            },
            {
            model: "gpt-4-32k",
            context: 32000,
            inPrice: 60,
            outPrice: 120,
            trainingDate: "Sep '21"
            },
            {
            model: "gpt-3.5-turbo-0125",
            context: 4000,
            inPrice: 0.5,
            outPrice: 1.5,
            trainingDate: "Sep '21"
            }
        ]
        },
        {
        company: "anthropic",
        url: "https://anthropic.com/news/claude-3-family",
        models: [
            {
            model: "claude-3-haiku-20240307",
            context: null,
            inPrice: 0.25,
            outPrice: 1.25,
            trainingDate: null
            },
            {
            model: "claude-3-sonnet-20240229",
            context: null,
            inPrice: 3,
            outPrice: 15,
            trainingDate: null
            },
            {
            model: "claude-3-opus-20240229",
            context: null,
            inPrice: 15,
            outPrice: 75,
            trainingDate: null
            }
        ]
        },
        {
        company: "google",
        url: "https://ai.google.dev/models/gemini",
        models: [
            {
            model: "gemini-1.0-pro-001",
            context: 30720,
            inPrice: "free",
            outPrice: 60,
            trainingDate: "Feb '24"
            },
            {
            model: "gemini-1.5-pro-latest",
            context: 1048576,
            inPrice: "free",
            outPrice: 2,
            trainingDate: "Feb '24"
            },
            {
            model: "gemini-nano",
            context: null,
            inPrice: 0.13,
            outPrice: 0.38,
            trainingDate: null
            }
        ]
        },
        {
        company: "mistralai",
        url: "https://docs.mistral.ai/platform/pricing",
        models: [
            {
            model: "mistral-small-latest",
            context: null,
            inPrice: 2,
            outPrice: 6,
            trainingDate: null
            },
            {
            model: "mistral-medium-latest",
            context: null,
            inPrice: 2.7,
            outPrice: 8.1,
            trainingDate: null
            },
            {
            model: "mistral-large-latest",
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

        div.innerHTML = '<h3>' + company.company + '</h3><br/>';
        models.appendChild(div);
    });
};