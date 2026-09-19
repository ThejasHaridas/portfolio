/* ==========================================================================
   data.js — all personal content lives here.
   Edit this file to update the portfolio; no other file needs to change.
   ========================================================================== */

const PROFILE = {
  name: 'Thejas Haridas',
  role: 'AI/ML Engineer · Data Scientist',
  location: 'Kochi, Kerala, India',
  email: 'thejasharidas@gmail.com',
  github: 'https://github.com/ThejasHaridas',
  githubUser: 'ThejasHaridas',
  linkedin: 'https://linkedin.com/in/thejas-haridas',
  summary:
    'AI/ML Engineer with hands-on experience building production LLM pipelines, biomedical ' +
    'knowledge graphs and document intelligence systems. I specialise in LLM orchestration ' +
    '(vLLM, LangChain, LangGraph), agentic workflows and graph-based knowledge representation ' +
    'with Neo4j.',
  detail:
    'Most of my work lives in regulated, data-intensive domains, so I spend a lot of time on the ' +
    'unglamorous parts: extraction pipelines that survive contact with messy source documents, ' +
    'self-correction loops, retry logic and structured prompt systems that keep model output ' +
    'predictable at scale.'
};

const EXPERIENCE = [
  {
    role: 'Junior AI/ML Engineer',
    org: 'FeatherSoft',
    place: 'Kochi, Kerala',
    kind: 'Full-time',
    from: 'Sep 2025',
    to: 'Present',
    current: true,
    points: [
      'Built a multi-stage LLM pipeline extracting structured data from clinical toxicology PDFs using a locally hosted vision model (Qwen via vLLM), turning rasterised document pages into structured JSON and Excel output.',
      'Designed and maintained a biomedical knowledge graph in Neo4j on the Biolink ontology, enabling semantic querying across preclinical research entities with full-text Lucene search and input sanitisation.',
      'Engineered structured XML prompt systems (extraction, structure detection, row-fill, Excel code generation) with self-correction loops, retry logic and layered JSON repair fallbacks to absorb model inconsistency at scale.',
      'Developed Python tooling for automated report generation from multi-report PDFs with page-offset tracking, sex-split appendix handling and openpyxl-based Excel output.'
    ]
  },
  {
    role: 'Trainee Data Scientist',
    org: 'Tyloones Software Private Limited',
    place: 'Noida',
    kind: 'Apprenticeship',
    from: 'Jan 2025',
    to: 'Jul 2025',
    points: [
      'Built LangChain-based data pipelines integrating SQL Server backends for structured retrieval and downstream ML workflows.',
      'Developed time series forecasting models and FastAPI microservices exposing ML predictions over REST.',
      'Handled data engineering work across ingestion, transformation and validation pipelines for business analytics.'
    ]
  },
  {
    role: 'Research and Development Intern',
    org: 'Digital University Kerala',
    place: 'Thiruvananthapuram',
    kind: 'Internship',
    from: 'May 2024',
    to: 'Dec 2024',
    points: [
      'Developed OCR-based document processing workflows using Label Studio for annotation and Python for post-processing.',
      'Contributed to ML research on image processing and optical character recognition for regional language documents.'
    ]
  }
];

const PROJECTS = [
  {
    id: 'clinical-pdf',
    name: 'Clinical PDF Extraction Pipeline',
    file: 'clinical_pdf_pipeline.py',
    icon: 'py',
    stack: 'vLLM · Qwen Vision · Python',
    kind: 'Professional work',
    blurb: 'End-to-end pipeline turning clinical toxicology PDFs into structured data.',
    body:
      'Rasterises clinical toxicology PDF pages, sends them to a locally hosted Qwen vision model ' +
      'via vLLM, and extracts structured hematology and toxicokinetic tables into JSON and Excel.\n\n' +
      'The interesting problem here was reliability, not extraction. Vision models drift on long ' +
      'documents, so the pipeline runs in multiple phases — table detection, structure consensus, ' +
      'then row fill — with self-correction loops and layered JSON repair fallbacks at each stage.',
    tags: ['vLLM', 'Qwen', 'Document AI', 'JSON repair', 'openpyxl'],
    link: null
  },
  {
    id: 'bio-kg',
    name: 'Biomedical Knowledge Graph',
    file: 'biomedical_kg.cypher',
    icon: 'db',
    stack: 'Neo4j · Biolink · Python',
    kind: 'Professional work',
    blurb: 'Preclinical research knowledge graph built on the Biolink ontology.',
    body:
      'A knowledge graph system for preclinical research data using Neo4j and the Biolink ontology.\n\n' +
      'Implemented full-text Lucene indexing with input sanitisation, YAML-based configuration and a ' +
      'Python query interface for semantic entity retrieval across research entities.',
    tags: ['Neo4j', 'Biolink', 'Lucene', 'Knowledge graphs'],
    link: null
  },
  {
    id: 'alcohol-sales',
    name: 'Alcohol Sales Prediction',
    file: 'fasttext_bigru_attention.ipynb',
    icon: 'nb',
    stack: 'FastText · BiGRU · Attention',
    kind: 'Research project',
    blurb: 'Text classification with explainability for a regulated forecasting context.',
    body:
      'A text classification pipeline using FastText embeddings, BiGRU layers and a self-attention ' +
      'mechanism for sales forecasting.\n\n' +
      'Because the context was regulated, interpretability mattered as much as accuracy — the model ' +
      'ships with SHAP-based explainability analysis so predictions can be defended, not just made.',
    tags: ['FastText', 'BiGRU', 'Attention', 'SHAP', 'NLP'],
    link: null
  },
  {
    id: 'depression-nlp',
    name: 'Depression Detection (NLP)',
    file: 'nlp_depression.ipynb',
    icon: 'nb',
    stack: 'Jupyter · NLP',
    kind: 'Open source',
    blurb: 'NLP coursework project on detecting depression signals in text.',
    body: 'An NLP project exploring depression signal detection in text data. Source on GitHub.',
    tags: ['NLP', 'Jupyter'],
    link: 'https://github.com/ThejasHaridas/NLP_PROJECT_DEPRESSION'
  },
  {
    id: 'medical-agent',
    name: 'Medical Agent',
    file: 'medical_agent.py',
    icon: 'py',
    stack: 'Python · LLM agents',
    kind: 'Open source',
    blurb: 'Agentic workflow experiment in the medical domain.',
    body: 'An agent-based experiment applying LLM orchestration to medical queries. Source on GitHub.',
    tags: ['Agents', 'LLM', 'Python'],
    link: 'https://github.com/ThejasHaridas/medical-agent'
  },
  {
    id: 'ocr-docling',
    name: 'OCR with Docling',
    file: 'ocr_docling.py',
    icon: 'py',
    stack: 'Python · OCR',
    kind: 'Open source',
    blurb: 'Document parsing and OCR pipeline experiments.',
    body: 'Document intelligence experiments using Docling for parsing and OCR. Source on GitHub.',
    tags: ['OCR', 'Document AI', 'Python'],
    link: 'https://github.com/ThejasHaridas/ocr_docling'
  },
  {
    id: 'career-agent',
    name: 'Career Agent',
    file: 'career_agent.py',
    icon: 'py',
    stack: 'Python · LLM agents',
    kind: 'Open source',
    blurb: 'An agent that helps reason about career and job data.',
    body: 'An LLM agent project built around career and job-search reasoning. Source on GitHub.',
    tags: ['Agents', 'LLM', 'Python'],
    link: 'https://github.com/ThejasHaridas/career-agent'
  },
  {
    id: 'chaos-audio',
    name: 'Chaos-based Audio Encryption',
    file: 'chaos_audio.py',
    icon: 'py',
    stack: 'Python · Cryptography',
    kind: 'Published research',
    blurb: 'The code behind my Franklin Open publication.',
    body:
      'A comparative study of chaos-based audio encryption schemes, published as first author in ' +
      'Franklin Open (Elsevier), September 2024.',
    tags: ['Cryptography', 'Signal processing', 'Research'],
    link: 'https://github.com/ThejasHaridas/chaos'
  }
];

const SKILLS = [
  {
    group: 'Programming & Libraries',
    items: [
      { name: 'Python', level: 95 },
      { name: 'Pandas / NumPy', level: 90 },
      { name: 'PyTorch / TensorFlow', level: 80 },
      { name: 'Scikit-learn', level: 85 },
      { name: 'FastAPI', level: 85 },
      { name: 'SQL', level: 80 },
      { name: 'PySpark', level: 65 },
      { name: 'OpenCV', level: 70 }
    ]
  },
  {
    group: 'AI / LLM',
    items: [
      { name: 'LangChain / LangGraph', level: 90 },
      { name: 'vLLM', level: 85 },
      { name: 'Prompt engineering (XML/CoT)', level: 90 },
      { name: 'RAG', level: 85 },
      { name: 'Agentic workflows', level: 85 },
      { name: 'Qwen vision models', level: 80 }
    ]
  },
  {
    group: 'Databases & Graph',
    items: [
      { name: 'Neo4j (Biolink, Lucene)', level: 85 },
      { name: 'Microsoft SQL Server', level: 75 },
      { name: 'ChromaDB / vector stores', level: 80 }
    ]
  },
  {
    group: 'Infrastructure & Tools',
    items: [
      { name: 'Docker', level: 75 },
      { name: 'Git', level: 85 },
      { name: 'Label Studio', level: 75 },
      { name: 'Streamlit', level: 80 },
      { name: 'Power BI', level: 65 }
    ]
  }
];

const EDUCATION = [
  {
    degree: 'M.Sc. Computer Science (Data Analytics)',
    org: 'Kerala University of Digital Sciences, Innovation and Technology',
    note: 'Digital University Kerala',
    years: '2023 – 2025'
  },
  {
    degree: 'B.Sc. Physics',
    org: 'Kerala University',
    note: '',
    years: 'Graduated 2023'
  }
];

const PUBLICATIONS = [
  {
    title: 'Chaos-based Audio Encryption: A Comparative Study',
    venue: 'Franklin Open (Elsevier)',
    date: 'September 2024',
    note: 'First author',
    link: null
  }
];

const CERTIFICATIONS = [
  { name: 'Neo4j Fundamentals', org: 'Neo4j', date: 'Sep 2024' },
  { name: 'Google Cloud Career Launchpad — Data Analytics Track', org: 'Google Cloud', date: 'Jun 2024' }
];

const ACHIEVEMENTS = [
  'First author on a peer-reviewed publication (Franklin Open, Elsevier) at postgraduate level.',
  'Qualified UGC NET in Computer Science.'
];
