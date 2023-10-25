import { Result } from "../GameRoom";

interface ResultsProps {
    results: Result[] | undefined;
}

export default function Results({ results }: ResultsProps) {
    if (results == undefined) {
        return <div>Results : Something went wrong :/</div>;
    }

    console.log(results);

    return (
        <div>
            {results.map((result, index) => (
                <div key={"result" + index}>
                    <hr />
                    {/* <div>user: {result.originatorID}</div> */}
                    <div>topic: {result.topic}</div>
                    <div>prompt: {result.prompt}</div>
                    <img src={result.imageURI} />
                    <div>guess: {result.guess}</div>
                </div>
            ))}
        </div>
    );
}
