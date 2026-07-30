enum DiscoveryTurnKind {
  QUESTION
  CANDIDATE
}

enum DiscoveryActionKind {
  SAVE_CANDIDATE
}

enum DiscoveryMethod {
  ALIVENESS
  JUDGMENT
}

enum DiscoveryStage {
  RECONSTRUCT_MOMENT
  IDENTIFY_LIVE_WIRE
  CAPTURE_JUDGMENT
  SEPARATE_FEELING
  IDENTIFY_TRIGGER
  TEST_BOUNDARY
  FIND_PORTABILITY
  FORM_CANDIDATE
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
  method DiscoveryMethod
  stage DiscoveryStage
  reply string
  candidate string?
  evidence_summary string?
  suggested_action DiscoverySuggestedAction?
}

class DiscoveryContinuationInput {
  current_stage DiscoveryStage?
  messages DiscoveryMessage[]
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

function RouteDiscovery(messages: DiscoveryMessage[]) -> DiscoveryTurn {
  client CodexSubscription

  prompt #"
    Choose and begin one evidence-led micro-motive discovery method.

    A micro-motive is one atomic thing the person enjoys, desires, dislikes, or
    avoids. It is not a career, identity, virtue, capability, prescription, or
    standardized motivation such as success, freedom, creativity, impact, or
    connection.

    Choose method ALIVENESS when the live evidence is primarily a real moment,
    activity, or experience the person loved, found satisfying, or felt alive
    within. Begin by reconstructing one concrete moment, then identify its exact
    rewarding live wire.

    Choose method JUDGMENT when the live evidence is primarily a strong positive
    or negative reaction to another person. Begin by establishing the concrete
    person, behavior, and immediate unedited judgment. Then separate the
    person's feeling from their evaluation of the other person.

    If both are present, choose the route attached to the most emotionally vivid
    evidence. If the account is ambiguous but describes a concrete lived moment,
    choose ALIVENESS. Do not ask the person to choose again.

    Ask exactly one focused, open question in this turn. Preserve the person's
    language. Do not offer multiple-choice interpretations, diagnose, moralize,
    prescribe a life, or announce the method in a clinical way.

    Return kind QUESTION. Return method as the route you chose. Return the
    earliest stage still missing:
    - ALIVENESS: RECONSTRUCT_MOMENT or IDENTIFY_LIVE_WIRE.
    - JUDGMENT: CAPTURE_JUDGMENT or SEPARATE_FEELING.
    candidate, evidence_summary, and suggested_action must be null.

    Conversation so far:
    {% for message in messages %}
    {{ message.role }}: {{ message.content }}
    {% endfor %}

    {{ ctx.output_format }}
  "#
}

function ContinueAlivenessDiscovery(input: DiscoveryContinuationInput) -> DiscoveryTurn {
  client CodexSubscription

  prompt #"
    Play the positive-lived-experience discovery method inspired by the
    principles in Dark Horse. The purpose is to uncover one atomic, highly
    personal micro-motive from something the person genuinely loved or found
    alive.

    Method invariant:
    - Return method ALIVENESS in every response.
    - Ask exactly one question per QUESTION turn.
    - The person is the only referee of what is true.
    - Treat interpretations as predictions, never declarations.
    - Use real memories and activities as evidence, never an invented ideal life.
    - Follow one emotionally vivid thread rather than a questionnaire.
    - Preserve strange, selfish, trivial, contradictory, or impractical rewards.
    - Do not diagnose, moralize, romanticize, or recommend a life or career.
    - Do not stop at an activity or standardized motive such as creativity,
      freedom, impact, connection, adventure, mastery, recognition, helping,
      success, or fun.

    Move through the stages according to the evidence, returning to an earlier
    stage when necessary:

    1. RECONSTRUCT_MOMENT
       Establish one concrete occasion: what happened, what the person did or
       witnessed, what changed, and the precise instant that felt most alive.
       If they supplied an activity category or long period, ask for one scene.

    2. IDENTIFY_LIVE_WIRE
       Identify what the person felt at the peak and the exact feature that
       produced it. Separate the surrounding story from the rewarding mechanism.
       Investigate concrete dimensions only when their account makes them
       relevant; never supply a menu of interpretations.

    3. TEST_BOUNDARY
       Use one counterfactual only when it distinguishes nearby explanations.
       Ask what would remain rewarding if one suspected feature changed. Never
       keep asking why merely to sound deeper.

    4. FIND_PORTABILITY
       Look for the same precise reward in a different real experience when
       portability is still uncertain. A second example is strong convergence,
       not permission for another round of causal excavation.

    5. FORM_CANDIDATE
       Offer one atomic candidate in the person's language once the evidence
       converges. Atomic does not mean infinitely reducible. One concrete
       experience plus an exact rewarding feature can be enough.

    Multiple threads:
    - Split independently rewarding features rather than combining them.
    - Follow the best-supported live thread to one candidate and preserve other
      threads for later.
    - Audit wording containing "and", "because", or "so that".

    Repair:
    - Treat "this is not helping", "too granular", "I already explained that",
      "I do not know what else to say", and repeated answers as feedback.
    - Do not drill into a new sensory detail or repeat the same question.
    - Return to the last supported live wire and offer it when sufficient. If it
      is not sufficient, ask what feels inaccurate or missing.

    Output contract:
    - Return kind QUESTION and the stage of the one question while evidence is
      incomplete. candidate, evidence_summary, and suggested_action must be null.
    - Return kind CANDIDATE and stage FORM_CANDIDATE only when one atomic current
      hypothesis is supported. Phrase candidate directly as "I enjoy...",
      "I want...", "I like...", or "I dislike...".
    - The candidate reply must ask: "Should I save this current wording? It can
      be refined later."
    - Include a concise evidence_summary and suggested_action with kind
      SAVE_CANDIDATE and label "YES — save this".
    - Never confirm or save the candidate yourself.

    Current stage, if any:
    {{ input.current_stage }}

    Conversation so far:
    {% for message in input.messages %}
    {{ message.role }}: {{ message.content }}
    {% endfor %}

    {{ ctx.output_format }}
  "#
}

function ContinueJudgmentDiscovery(input: DiscoveryContinuationInput) -> DiscoveryTurn {
  client CodexSubscription

  prompt #"
    Play the Game of Judgment from Dark Horse to uncover one atomic, highly
    personal micro-motive from a strong positive or negative reaction to another
    person.

    Method invariant:
    - Return method JUDGMENT in every response.
    - Ask exactly one question per QUESTION turn.
    - The person is the only referee of what is true.
    - Treat interpretations as predictions, never declarations.
    - Honest, strange, selfish, trivial, contradictory, or impractical
      judgments are safe evidence.
    - Follow the live evidence rather than administering a questionnaire.
    - Preserve the person's wording whenever possible.
    - Do not diagnose, moralize, romanticize, excuse, condemn, or recommend a
      life or career.

    Establish only what is still missing:

    1. CAPTURE_JUDGMENT
       Establish the concrete person, their observable behavior, and the
       person's immediate unedited positive or negative judgment.

    2. SEPARATE_FEELING
       Identify what the person themselves felt. Keep that feeling distinct
       from their evaluation of the other person.

    3. IDENTIFY_TRIGGER
       Identify the exact feature of the behavior that produced the feeling.
       Challenge broad or standardized wording by asking what specifically
       triggered the reaction.

    4. TEST_BOUNDARY
       Use one counterfactual or second lived example only when it distinguishes
       nearby motives. Do not continue probing merely to make the result deeper.

    5. FORM_CANDIDATE
       When the person directly states or clearly supports a plausible atomic
       motive, stop excavating and reflect it back promptly with at most a light
       grammatical edit.

    Splitting:
    - One judgment can reveal multiple micro-motives. Never combine independently
      rewarding or aversive features merely because they occurred together.
    - Audit wording containing "and", "because", or "so that".
    - Follow one branch to one candidate and preserve other branches for later.

    Repair:
    - Treat "this is not helping", "too granular", "I already explained that",
      "I do not know what else to say", and repeated answers as feedback.
    - Return to the last supported trigger. Offer it if the evidence is
      sufficient; otherwise ask one question about what is inaccurate or missing.

    Output contract:
    - Return kind QUESTION and the stage of the one question while evidence is
      incomplete. candidate, evidence_summary, and suggested_action must be null.
    - Return kind CANDIDATE and stage FORM_CANDIDATE only when one atomic current
      hypothesis is supported. Phrase candidate directly as "I enjoy...",
      "I want...", "I like...", or "I dislike...".
    - The candidate reply must ask: "Should I save this current wording? It can
      be refined later."
    - Include a concise evidence_summary and suggested_action with kind
      SAVE_CANDIDATE and label "YES — save this".
    - Never confirm or save the candidate yourself.

    Current stage, if any:
    {{ input.current_stage }}

    Conversation so far:
    {% for message in input.messages %}
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
