import React from "react";
import { render, screen } from "@testing-library/react";
import QuestionsListContainer from "@/app/(main)/dashboard/create-interview/_components/QuestionsListContainer";

describe("QuestionsListContainer", () => {
  test("renders list of questions", () => {
    const questions = [
      { question: "What is React?", type: "Technical" },
      { question: "Tell me about yourself.", type: "Behavioral" },
    ];

    render(<QuestionsListContainer questionList={questions} />);

    expect(
      screen.getByText("Generated Interview Questions")
    ).toBeInTheDocument();

    expect(screen.getByText("What is React?")).toBeInTheDocument();
    expect(screen.getByText(/Technical/i)).toBeInTheDocument();

    expect(screen.getByText("Tell me about yourself.")).toBeInTheDocument();
    expect(screen.getByText(/Behavioral/i)).toBeInTheDocument();
  });

  test("renders gracefully when list is empty", () => {
    render(<QuestionsListContainer questionList={[]} />);

    expect(
      screen.getByText("Generated Interview Questions")
    ).toBeInTheDocument();
  });

  test("handles undefined questionList without crashing", () => {
    render(<QuestionsListContainer />);

    expect(
      screen.getByText("Generated Interview Questions")
    ).toBeInTheDocument();
  });
});
