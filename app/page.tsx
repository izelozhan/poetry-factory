"use client";

import Dropdown from "./components/Dropdown/Dropdown";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import Spinner from "./components/Spinner/Spinner";
import Header from "./components/Header/Header";
import { Card } from "./components/Card/Card";

export default function Home() {
  // const promptRef: MutableRefObject<HTMLTextAreaElement | null> =
  // useRef<HTMLTextAreaElement | null>(null);
  const [state, setState] = useState({
    selectedFeeling: [],
    selectedAuthor: [],
    authors: [],
    feelings: [],
    poem: "",
    isGenerating: false,
    isValid: false,
    prompt: "",
  });

  const setValidity = () => {
    const valid =
      state.selectedAuthor && state.selectedAuthor.length > 0 && state.prompt
        ? true
        : false;
    console.log(valid);
    if (valid !== state.isValid) {
      setState((curr) => ({ ...curr, isValid: valid }));
    }
  };

  const nonFormOnChange = (val: any, type: "feeling" | "author") => {
    if (type === "feeling") {
      fetch(`/api/poets`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          feeling: val.value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setState((curr) => ({
            ...curr,
            authors: data.message,
            selectedFeeling: val,
          }));
        })
        .catch((err) => {
          setState((curr) => ({ ...curr, selectedAuthor: [] }));
          console.log("handle error");
        });
    } else {
      setState((curr) => ({ ...curr, selectedAuthor: val }));
    }
  };

  const generate = () => {
    if (state.isGenerating) {
      return;
    }

    setState((curr) => ({ ...curr, isGenerating: true }));

    fetch("/api/generate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        feelings: (state.selectedFeeling as any)["value"],
        authors: state.selectedAuthor.map((i: any) => i.value),
        concept: state.prompt,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setState((curr) => ({
          ...curr,
          isGenerating: false,
          poem: data.message,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadFeelings = () => {
    fetch("/api/feelings")
      .then((res) => res.json())
      .then((data) => {
        setState((curr) => ({ ...curr, feelings: data.message }));
      })
      .catch((err) => {
        //handle error
      });
  };

  useEffect(() => {
    loadFeelings();
  }, []);

  setValidity();

  return (
    <>
      <div className="absolute inset-0 flex flex-col min-h-screen items-center overflow-x-hidden pb-16">
        <div className="flex flex-1 flex-col sm:w-3/4 px-5">
          <Header />
          <div className="container mx-auto pt-4">
            <div className="grid grid-cols-2 gap-8">
              <div className="grid grid-rows gap-4 h-fit">
                <Card title={"Choose your mood"}>
                  <Dropdown
                    disabled={state.feelings.length === 0}
                    nonFormOnChange={(val) => nonFormOnChange(val, "feeling")}
                    placeholder={"e.g., Joy, Love"}
                    control={null}
                    isRequired={false}
                    name="feelings"
                    multiple={false}
                    options={state.feelings.map((i) => ({
                      value: i,
                      label: i,
                    }))}
                    selectedValues={state.selectedFeeling}
                  />
                </Card>
                <Card title={"Define your style"}>
                  <Dropdown
                    disabled={state.authors.length === 0}
                    nonFormOnChange={(val) => nonFormOnChange(val, "author")}
                    placeholder={"e.g,. Shakespeare, Cervantes"}
                    control={null}
                    isRequired={false}
                    name="authors"
                    multiple={true}
                    options={state.authors.map((i) => ({ value: i, label: i }))}
                    selectedValues={state.selectedAuthor}
                  />
                </Card>
                <Card title={"Explore prompts"}>
                  <textarea
                    placeholder="e.g., Midnight thoughts, Childhood memories"
                    onChange={(e) =>
                      setState((curr) => ({ ...curr, prompt: e.target.value }))
                    }
                    className=" w-full p-2 h-18  rounded-xl border  border-goldfish gap-2.5 hover:border-goldfish focus:border-goldfish active:border-goldfish  text-text-dark outline-none tracking-widest"
                  ></textarea>
                </Card>
                <button
                  onClick={generate}
                  disabled={!state.isValid || state.isGenerating}
                  className="bg-goldfish hover:bg-teal hover:text-goldfish   text-teal font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate
                </button>
              </div>

              <div className="p-6 rounded-lg shadow-lg bg-white promptBG">
                <div className="text-xl font-playfair text-text-dark flex items-center p-4 break-words w-128 whitespace-pre-line justify-evenly font-medium">
                  {state.isGenerating && <Spinner />}
                  {!state.isGenerating && (
                    <>
                      {state.poem ? (
                        state.poem
                      ) : (
                        <div>
                          Watch this space for your custom poem!
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
