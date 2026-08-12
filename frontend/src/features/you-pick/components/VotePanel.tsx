import { useEffect, useState, type FormEvent } from "react";
import { FLAVOUR_OPTIONS, PACK_OPTIONS, packMaterial } from "../model/options";
import type { VoteSelections } from "../model/types";

const EMPTY_VOTE: VoteSelections = { pack: [], flavour: [] };

interface VotePanelProps {
  participantReady: boolean;
  participantHasVoted: boolean;
  submitting: boolean;
  error: string | null;
  feedback: string | null;
  onSubmit: (selections: VoteSelections) => Promise<boolean>;
}

export function VotePanel(props: VotePanelProps) {
  const [selections, setSelections] = useState<VoteSelections>(EMPTY_VOTE);
  const [editing, setEditing] = useState(!props.participantHasVoted);

  useEffect(() => {
    if (props.participantHasVoted) setEditing(false);
  }, [props.participantHasVoted]);

  const toggle = (category: keyof VoteSelections, option: string) => {
    setSelections((current) => {
      if (category === "pack") {
        return { ...current, pack: current.pack[0] === option ? [] : [option] };
      }
      return {
        ...current,
        flavour: current.flavour.includes(option)
          ? current.flavour.filter((value) => value !== option)
          : [...current.flavour, option],
      };
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (await props.onSubmit(selections)) setEditing(false);
  };

  return (
    <div className="rounded-2xl border bg-white p-6 border-[#ffeaf4]">
      <h2 className="font-extrabold mb-3">Vote</h2>
      {!editing ? (
        <div>
          <p className="text-sm text-gray-600 mb-3">Thank you. Your vote is counted. ✨ Changed your mind? Vote again.</p>
          <button type="button" onClick={() => setEditing(true)} className="rounded-full px-4 py-2 border text-sm">
            Change my vote
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <fieldset>
            <legend className="text-sm font-semibold mb-2">Pack (choose one)</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PACK_OPTIONS.map((option) => {
                const selected = selections.pack.includes(option);
                const [title, subtitle] = option.split("·").map((part) => part.trim());
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggle("pack", option)}
                    className={`text-left p-3 rounded-2xl border ${selected ? "bg-black text-white" : "bg-[#fffdfd]"}`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{title}</span>
                      <span className={`text-xs px-3 py-1 rounded-full min-w-[86px] text-center border ${selected ? "border-white/20" : "bg-white text-gray-800 border-gray-200"}`}>
                        {packMaterial(option)}
                      </span>
                    </span>
                    <span className={`block text-xs mt-1 ${selected ? "text-gray-200" : "text-gray-700"}`}>{subtitle}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold mb-2">Flavour (choose any)</legend>
            <div className="flex gap-2 flex-wrap">
              {FLAVOUR_OPTIONS.map((option) => {
                const selected = selections.flavour.includes(option);
                return (
                  <button
                    type="button"
                    key={option}
                    aria-pressed={selected}
                    onClick={() => toggle("flavour", option)}
                    className={`px-3 py-2 rounded-full border ${selected ? "bg-black text-white" : "bg-[#fffdfd]"}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={props.submitting || !props.participantReady}
              className="rounded-full px-5 py-2 text-sm font-semibold text-white bg-[#FF89CC] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {props.submitting ? "Saving…" : "Submit vote"}
            </button>
            <button type="button" onClick={() => setSelections(EMPTY_VOTE)} className="rounded-full px-4 py-2 border text-sm" disabled={props.submitting}>
              Reset
            </button>
          </div>
          {!props.participantReady && <p className="text-sm text-gray-600">Anonymous participation is still starting.</p>}
        </form>
      )}
      <div aria-live="polite" className="mt-3">
        {props.error && <p className="text-sm text-red-700">{props.error}</p>}
        {props.feedback && <p className="text-sm text-green-700">{props.feedback}</p>}
      </div>
    </div>
  );
}
