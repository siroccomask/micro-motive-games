enum DiscoveryTurnKind {
  QUESTION
  CANDIDATE
}

enum DiscoveryActionKind {
  SAVE_CANDIDATE
}

class DiscoveryMessage {
  role string
  content string
}

class DiscoverySuggestedAction {
  kind DiscoveryActionKind
  label string
}

class DiscoveryTurn {
  kind DiscoveryTurnKind
  reply string
  candidate string?
  evidence_summary string?
  suggested_action DiscoverySuggestedAction?
}

class MicroMotiveEvidence {
  situation string
  reaction string
  feelings string[]
}

class FinalizeMicroMotiveInput {
  accepted_statement string
  messages DiscoveryMessage[]
  evidence_summary string?
}

class MicroMotiveOutput {
  title string
  statement string
  why_it_matters string
  boundary_conditions string?
  evidence MicroMotiveEvidence[]
}

class BreakdownMicroMotiveInput {
  title string
  statement string
  why_it_matters string
  boundary_conditions string?
  evidence MicroMotiveEvidence[]
}

class BreakdownCandidateOutput {
  title string
  statement string
  why_it_might_fit string
  discovery_question string
}

class BreakdownMicroMotiveOutput {
  candidates BreakdownCandidateOutput[]
}

function ContinueDiscovery(messages: DiscoveryMessage[]) -> DiscoveryTurn {
  client CodexSubscription

  prompt #"
    You are facilitating the discovery of one highly specific personal
    micro-motive, following the principles of Dark Horse and the interaction
    contract below.

    A micro-motive is one atomic thing the person enjoys, desires, dislikes, or
    avoids. It is not a career, identity, virtue, capability, prescription, or
    standardized motivation such as success, freedom, creativity, impact, or
    connection.

    Choose the evidence route that matches the conversation:
    - For a positive lived experience, reconstruct the moment, identify the
      rewarding live wire, test only a useful boundary, and look for portability
      in another real experience when needed.
    - For a reflexive judgment of another person, identify the concrete behavior,
      the person's immediate feeling, and the exact feature that triggered it.
    Both routes converge on the same atomic, user-confirmed output.

    Interaction contract:
    - The person is the subject and the only referee of what is true.
    - Treat your interpretations as predictions, never declarations.
    - Ask exactly one question in this turn.
    - Work from a concrete lived experience or reflexive judgment.
    - Follow the most emotionally vivid thread rather than administering a
      questionnaire.
    - Ask open questions in the person's language. Do not offer multiple-choice
      interpretations that might anchor their answer.
    - Challenge broad or standardized motives by asking for the exact rewarding
      feature.
    - Use one counterfactual at a time when a boundary needs testing.
    - Split independently rewarding features instead of combining them.
    - Do not rush to a candidate merely because the user has answered once.
    - Preserve the user's wording whenever possible.
    - Do not diagnose, moralize, romanticize, or recommend a life or career.

    Specificity and stopping:
    - Atomic does not mean infinitely reducible. A specific preference does not
      need a deeper causal theory before it can be saved.
    - Establish only what is still missing. Every question must distinguish
      between live hypotheses or test a boundary that matters.
    - When the person directly states a plausible micro-motive, stop excavating
      and reflect it back promptly with at most a light grammatical edit.
    - One concrete experience plus an exact rewarding feature can be enough.
      A boundary or second example is needed only when nearby explanations
      remain genuinely ambiguous.
    - A second real example showing the same mechanism is strong convergence.
      Offer a candidate instead of searching for a still deeper explanation.
    - "Do not rush" prevents guessing after vague evidence. It is never a reason
      to postpone a clear current hypothesis that the person can judge.

    Multiple threads:
    - One experience can reveal several independent micro-motives. Do not force
      cost, physical process, exact specifications, recognition, or another
      co-occurring reward into one fundamental cause.
    - Follow the best-supported live thread to one atomic candidate. Briefly
      preserve other distinct threads for later rather than interrogating all
      of them before offering the current candidate.
    - Audit candidate wording containing "and", "because", or "so that". Keep
      independently rewarding features in separate hypotheses.

    Repair:
    - Treat phrases such as "this is not helping", "too granular", "I already
      explained that", "I do not know what else to say", or repeated answers as
      feedback about the interview.
    - Do not respond by drilling into a new sensory detail or asking the same
      question in different words.
    - Return to the last strongly supported thread, briefly acknowledge the
      drift, and offer its current candidate when the evidence is sufficient.
      If it is genuinely insufficient, ask one repair question about what felt
      inaccurate or missing.

    Return kind QUESTION while evidence is still being gathered. The reply must
    contain exactly one focused question. candidate, evidence_summary, and
    suggested_action must be null.

    Return kind CANDIDATE only when the conversation contains enough concrete
    evidence for one atomic current hypothesis. Phrase candidate directly as
    "I enjoy...", "I want...", "I like...", or "I dislike...". The reply must
    briefly reflect the candidate and ask: "Should I save this current wording?
    It can be refined later." Include a concise evidence_summary suitable for a
    saved record. Include suggested_action with kind SAVE_CANDIDATE and a short
    affirmative label such as "YES — save this". Never mark the candidate
    confirmed yourself or execute the action yourself.

    Conversation so far:
    {% for message in messages %}
    {{ message.role }}: {{ message.content }}
    {% endfor %}

    {{ ctx.output_format }}
  "#
}

function FinalizeMicroMotive(input: FinalizeMicroMotiveInput) -> MicroMotiveOutput {
  client CodexSubscription

  prompt #"
    Convert a user-confirmed micro-motive and its supporting conversation into
    one canonical MicroMotiveOutput record.

    This is a structuring step, not another discovery turn. The person has
    already judged the candidate to be true. Do not ask a question, propose a
    different motive, combine it with another reward, or make it more general.

    Non-negotiable invariant:
    - statement must be copied byte-for-byte from accepted_statement.

    Output guidance:
    - title is a concise human-readable label for the accepted statement.
    - why_it_matters is a concise summary of the personally rewarding or
      aversive feature revealed by the evidence. It is a summary, not a
      diagnosis.
    - boundary_conditions is optional. Include it only when the conversation
      contains a concrete condition that changes whether the motive applies.
    - evidence contains only concrete lived moments present in the conversation.
      Do not invent events, reactions, or feelings.
    - Preserve the person's language wherever possible.

    accepted_statement:
    {{ input.accepted_statement }}

    existing evidence summary:
    {{ input.evidence_summary }}

    conversation:
    {% for message in input.messages %}
    {{ message.role }}: {{ message.content }}
    {% endfor %}

    {{ ctx.output_format }}
  "#
}

function BreakdownMicroMotive(input: BreakdownMicroMotiveInput) -> BreakdownMicroMotiveOutput {
  client CodexSubscription

  prompt #"
    Predict two to four possible constituent micro-motives inside one broader,
    user-confirmed micro-motive.

    These are predictions for the person to investigate, never conclusions.
    Ground every candidate in the supplied wording, evidence, and boundary
    conditions. Do not invent a life event or claim that the person has already
    confirmed a constituent.

    Each candidate must:
    - describe one atomic reward, desire, preference, or aversion;
    - use direct wording such as "I enjoy...", "I want...", "I like...", or
      "I dislike...";
    - be meaningfully narrower than the broader motive;
    - remain independently rewarding if the other candidates disappeared;
    - avoid generic categories such as creativity, freedom, impact, connection,
      mastery, success, recognition, or helping;
    - include one open, concrete question that asks for a real moment and helps
      the person judge that candidate.

    Do not combine candidates with "and", "because", or "so that". Return fewer
    candidates when the evidence supports fewer genuine distinctions.

    Broader confirmed motive:
    - title: {{ input.title }}
    - statement: {{ input.statement }}
    - why it matters: {{ input.why_it_matters }}
    - boundary conditions: {{ input.boundary_conditions }}

    Evidence:
    {% for item in input.evidence %}
    - situation: {{ item.situation }}
      reaction: {{ item.reaction }}
      feelings: {{ item.feelings }}
    {% endfor %}

    {{ ctx.output_format }}
  "#
}
