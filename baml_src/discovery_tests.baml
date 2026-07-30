// Regression source: the desk and killswitch conversation that exposed the
// difference between useful specificity and endless causal excavation.

test DeskAndKillswitchOfferCandidate {
  functions [ContinueDiscovery]
  args {
    messages [
      {
        role "guide"
        content "Begin with one real moment: when did you feel unusually alive, or notice a strong reaction to someone? What happened?"
      },
      {
        role "user"
        content "I built a custom desk out of butcher block because I wanted a huge desk that was sturdy, wide, and wood, but I did not want to pay $1000 for the options on the market."
      },
      {
        role "guide"
        content "When you first used the finished desk, what specific feature felt most satisfying?"
      },
      {
        role "user"
        content "The quality. I built something really nice for a good price, and it has been a great desk ever since."
      },
      {
        role "guide"
        content "What was the exact rewarding feature of the quality?"
      },
      {
        role "user"
        content "The combination of it being a good deal and the fact that I decided to create it and then was able to make it exist."
      },
      {
        role "guide"
        content "If it had cost the same as a comparable finished desk, what would still have felt rewarding?"
      },
      {
        role "user"
        content "This desk was made to my specification, and there was not anything else like it. If something existed, I suppose I would have bought it, but it did not."
      },
      {
        role "guide"
        content "Think of another one-off project you built because what you wanted was not offered."
      },
      {
        role "user"
        content "The killswitch in my car. Available options were thousands of dollars or physically inconvenient. I like being able to exercise my choice and design something that meets my requirements explicitly."
      }
    ]
  }

  @@assert(candidate_ready, {{ this.kind == "CANDIDATE" }})
  @@assert(candidate_present, {{ this.candidate is not none }})
  @@assert(save_action_present, {{ this.suggested_action is not none }})
  @@check(
    preserves_live_thread,
    {{
      this.candidate|lower|regex_match(
        "choice|requirement|specification|one-off|not offered|available option"
      )
    }}
  )
}

test RepairAfterOverGranularDeskQuestions {
  functions [ContinueDiscovery]
  args {
    messages [
      {
        role "guide"
        content "What specifically felt rewarding about having the desk match your specification when nothing else like it existed?"
      },
      {
        role "user"
        content "I wanted a lot of space, but sturdy. I like building one-off projects that are not offered."
      },
      {
        role "guide"
        content "Think of another one-off project you built because what you wanted was not offered."
      },
      {
        role "user"
        content "The killswitch in my car. Existing options were thousands of dollars or inconvenient. I like being able to exercise my choice and design something that meets my requirements explicitly."
      },
      {
        role "guide"
        content "If someone else physically built it for you at the same cost, what would have been missing?"
      },
      {
        role "user"
        content "I do not feel like this question is helping."
      },
      {
        role "guide"
        content "During either build, what physical action did you most enjoy doing with your own hands?"
      },
      {
        role "user"
        content "Assembly is satisfying."
      },
      {
        role "guide"
        content "What exactly is satisfying about assembly for you?"
      },
      {
        role "user"
        content "This is getting too granular. I am not sure why assembly is satisfying."
      },
      {
        role "guide"
        content "Looking across the desk and killswitch, what single part of the shared pattern matters most to you?"
      },
      {
        role "user"
        content "I already explained that. I feel like we were honing in at one point and have gotten off track."
      }
    ]
  }

  @@assert(repairs_with_candidate, {{ this.kind == "CANDIDATE" }})
  @@assert(candidate_present, {{ this.candidate is not none }})
  @@assert(save_action_present, {{ this.suggested_action is not none }})
  @@check(
    returns_to_supported_thread,
    {{
      this.candidate|lower|regex_match(
        "choice|requirement|specification|one-off|not offered|available option"
      )
    }}
  )
}
