export const dataScientistInterviewQuestions = [
    {
        question: 'What experience do you have working with sports or domain-specific data?',
        testing:
            'Interviewers want to know whether you can learn the business context behind a dataset, not just run models. Sports data can come from box scores, tracking systems, betting markets, ticketing platforms, CRM tools, scouting reports, video tags, or product events.',
        answer:
            'Frame your answer around a real dataset and the decision it supported. A strong response might mention cleaning event-level data, defining player or fan metrics, validating assumptions with domain experts, and turning analysis into a recommendation. If your past work was outside sports, connect the same habits to sports use cases without pretending you have league-specific expertise you do not have.',
    },
    {
        question: 'How do you clean messy, incomplete, or inconsistent sports data?',
        testing:
            'They are checking whether you can protect the analysis from bad inputs. Sports datasets often have missing player IDs, inconsistent team names, late injury updates, duplicated events, clock issues, tracking gaps, or data from multiple vendors.',
        answer:
            'Explain a repeatable process: inspect data quality, define expected ranges, standardize identifiers, handle missing values based on why they are missing, document assumptions, and run validation checks. Mention that the right fix depends on the use case: a scouting report, injury-risk model, betting model, or fan dashboard may tolerate different levels of uncertainty.',
    },
    {
        question: 'Walk me through your process for building a predictive model.',
        testing:
            'This question tests whether you understand the full modeling workflow, from problem framing to deployment or communication. In sports, the hard part is often choosing the right target and avoiding leakage from future information.',
        answer:
            'Start with the decision the model should improve, then describe data collection, leakage checks, feature engineering, baseline models, validation strategy, error analysis, and communication. Use metrics that match the problem, such as calibration for probabilities, ranking quality for scouting, or business lift for product and ticketing use cases.',
    },
    {
        question: 'How have you used machine learning in a previous project?',
        testing:
            'The interviewer wants evidence that you can apply machine learning responsibly, not just list algorithms. They may listen for problem selection, model choice, evaluation, interpretability, and whether the model actually helped someone make a better decision.',
        answer:
            'Describe one project end to end. Keep the algorithm secondary to the problem: forecasting churn, predicting player availability, classifying video events, estimating win probability, or ranking prospects. Include why the model was appropriate, how you evaluated it, what failed, and how the output was used.',
    },
    {
        question: 'How do you explain complex data science work to non-technical stakeholders?',
        testing:
            'Sports data scientists often work with coaches, scouts, executives, product managers, marketers, or operators. This question checks whether you can translate uncertainty and tradeoffs into decisions.',
        answer:
            'Say that you start with the stakeholder decision, avoid unnecessary math, use visuals carefully, and explain confidence, limitations, and next steps. A good sports example could be turning a model output into coaching options, a scouting shortlist, a retention strategy, or a product experiment recommendation.',
    },
    {
        question: 'How do you choose the right metric for a model or analysis?',
        testing:
            'They are checking whether you connect metrics to real outcomes. Accuracy is rarely enough. A betting model, fan segmentation model, player ranking model, and injury-risk model all need different evaluation criteria.',
        answer:
            'Explain that you first define the decision and the cost of different mistakes. Then choose metrics that reflect that cost, such as log loss for probability estimates, precision at the top of a ranking, recall for risk screening, revenue lift for business analytics, or calibration when probabilities drive decisions.',
    },
    {
        question: 'How would you engineer features from play-by-play, tracking, or event data?',
        testing:
            'This tests whether you can turn raw sports events into useful model inputs while respecting time, context, and leakage. Feature engineering is often where domain understanding shows up.',
        answer:
            'Talk about aggregating events into context-aware features: possession state, game situation, rest, opponent strength, player role, spatial location, sequence history, or recent workload. Mention that features should be available at prediction time and validated with domain knowledge, not only selected because they improve a leaderboard score.',
    },
    {
        question: 'Tell me about a time your model or analysis was wrong.',
        testing:
            'Interviewers want humility, diagnostic skill, and a clear feedback loop. In sports, models can fail because player roles change, data collection changes, sample sizes are small, or the environment shifts.',
        answer:
            'Pick a specific example and explain what you learned. A strong answer covers the original assumption, the signal that something was wrong, the investigation, and the change you made. Avoid blaming the data alone; show how you improved validation, monitoring, communication, or scope.',
    },
    {
        question: 'How do you work with unstructured or semi-structured data?',
        testing:
            'Sports organizations may use text, video tags, scouting notes, social posts, images, sensor feeds, JSON event streams, or scraped data. The interviewer wants to know whether you can structure messy inputs without losing meaning.',
        answer:
            'Explain how you parse, normalize, label, and validate the source before modeling. For text, mention entity extraction, sentiment or topic modeling, and human review. For event streams or video tags, mention schema checks and quality control. Tie the work back to a practical outcome, such as scouting, media, product, or fan engagement.',
    },
    {
        question: 'What visualization or dashboarding tools have you used?',
        testing:
            'They want to know whether you can make data usable for people who need to act quickly. Dashboards in sports can support coaches, executives, ticketing teams, product teams, or media workflows.',
        answer:
            'Name the tools you have used, such as Tableau, Power BI, Looker, Streamlit, Shiny, Plotly, or custom web dashboards. Then focus on design choices: selecting useful metrics, reducing noise, adding filters, showing trends, and making sure the dashboard answers recurring questions instead of becoming a data dump.',
    },
    {
        question: 'How do you collaborate with product, coaching, scouting, marketing, or business teams?',
        testing:
            'This question checks whether you can work across functions and understand that sports analytics jobs are rarely isolated research roles. The best analysts shape questions with the people who own the decision.',
        answer:
            'Describe how you clarify the goal, learn the workflow, agree on success criteria, share early drafts, and adjust based on feedback. Use examples across sports performance and sports business so the answer does not sound limited to one department.',
    },
    {
        question: 'How do you stay current with data science and sports analytics?',
        testing:
            'Interviewers are looking for curiosity and judgment. They want someone who keeps learning but can separate useful methods from hype.',
        answer:
            'Mention a mix of technical learning, sports analytics research, public datasets, conferences, newsletters, papers, open-source projects, and portfolio experiments. Emphasize that you test new methods on realistic problems and keep fundamentals like validation, communication, and domain fit at the center.',
    },
];

export const interviewPrepCards = [
    {
        title: 'What interviewers are testing',
        text: 'Most sports data science interviews test practical judgment: framing the right question, cleaning imperfect data, choosing useful metrics, communicating uncertainty, and connecting analysis to a decision.',
    },
    {
        title: 'How sports-specific to be',
        text: 'Use sports examples when they clarify your answer, but do not force every response into one league or team setting. Many roles sit in betting, media, fan engagement, product analytics, ticketing, and sports technology.',
    },
    {
        title: 'What to prepare',
        text: 'Bring one strong project story, one modeling story, one messy-data story, one stakeholder communication story, and a clear explanation of the sports problems you are most excited to solve.',
    },
];
