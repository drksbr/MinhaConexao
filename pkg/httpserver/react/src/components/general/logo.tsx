import { useColorMode } from '@chakra-ui/react';


type LogoProps = {
    className?: string;
};

const Logo: React.FC<LogoProps> = ({ className }) => {
    const { colorMode } = useColorMode();


    // Definir as cores com base no tema atual
    const fillColorPrimary = colorMode === 'light' ? '#000' : '#fff'; // Branco no tema escuro e preto no tema claro
    const fillColorSecondary = colorMode === 'light' ? '#f43f5a' : '#f43f5a'; // A cor secundária permanece a mesma

    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 715.4 101.4"
            width="150"
            height="150"
        >
            <path
                d="M4141 2873c0-5 339-651 753-1438L5647 5h545l199 382 198 381-127 233c-70 127-131 232-137 232-5 0-102-169-216-375-113-207-212-386-220-398-15-22-42 28-1016 1882l-62 118 622-2 621-3 668-1225L7389 5h465l743 1430c408 787 743 1433 743 1438 0 4-478 7-1062 7l-1063-1-234-429c-137-251-238-427-244-421-5 5-109 197-232 427l-223 419-1071 3c-589 1-1071-1-1070-5zm4456-535c-35-68-275-529-532-1026s-469-902-470-900c-5 5-576 1079-582 1094-2 7 111 225 253 484l257 470h1139z"
                style={{ fill: fillColorPrimary }}
                transform="matrix(-.03528 0 0 .03528 329.5 -.2)"
            />
            <path
                d="M4141 2873c0-5 339-651 753-1438L5647 5h545l199 382 198 381-127 233c-70 127-131 232-137 232-5 0-102-169-216-375-113-207-212-386-220-398-15-22-42 28-1016 1882l-62 118 622-2 621-3 668-1225L7389 5h465l743 1430c408 787 743 1433 743 1438 0 4-478 7-1062 7l-1063-1-234-429c-137-251-238-427-244-421-5 5-109 197-232 427l-223 419-1071 3c-589 1-1071-1-1070-5zm4456-535c-35-68-275-529-532-1026s-469-902-470-900c-5 5-576 1079-582 1094-2 7 111 225 253 484l257 470h1139z"
                style={{ fill: fillColorSecondary }}
                transform="matrix(.03528 0 0 -.03528 -6.2 101.6)"
            />
            <path
                d="M624 22.7q-7.7 0-15.4-2-1.1-.3-1.1-1.3v-5.6q0-1.3 1.3-1.2l6.8.6q3.3.3 6.8.3 4.4 0 6-1.6 1.8-1.5 1.8-4.4 0-2.4-1.1-4.2-1.2-1.7-3.8-3l-9-4q-4.9-2.3-7-5.7-2-3.5-2-8.4 0-7.2 4-10.7 4-3.5 13-3.5 3.6 0 7.2.5 3.6.6 7 1.5.5.1.8.4.3.2.3.8v5.6q0 1.2-1.3 1.2l-6-.6-5.8-.2q-4 0-5.8 1.2-1.7 1.2-1.7 4.1 0 2.3 1.2 3.8 1.2 1.6 3.7 2.8l9.4 4.3q4.8 2.2 6.6 5.8 2 3.6 2 8.8 0 3.4-1 6.1-.9 2.7-3 4.6-2 2-5.5 3-3.4 1-8.4 1zm47.6 0q-11.6 0-16.9-6.6-5.3-6.6-5.3-19.3v-2.9q0-12.8 5.3-19.3 5.3-6.6 17-6.6 11.6 0 16.8 6.6 5.3 6.5 5.3 19.3v2.9q0 12.7-5.3 19.3-5.2 6.6-16.9 6.6zm10.5-28.5q0-9-2.4-13-2.3-4-8-4-5.8 0-8.2 4-2.4 4-2.4 13v2.3q0 9 2.4 13t8.1 4q5.8 0 8.1-4 2.4-4 2.4-13zm21.7-24q0-1.3 1.1-1.3h9.4q1.2 0 1.2 1.2v39q0 2.2.7 3.3.8 1 3.1 1h18q1.1 0 1.1 1.3v5.5q0 1.5-1.3 1.6l-9.5.6q-5.3.3-11 .3-3.6 0-6.1-.6-2.4-.6-4-2-1.5-1.3-2.1-3.4-.6-2.1-.6-5.2zm68.8 0q0-1.3 1.1-1.3h9.4q1.2 0 1.2 1.2v27q0 6.2-1 11-.7 4.6-3 8-2.3 3.2-6.2 4.9-4 1.7-10 1.7t-10-1.7q-3.9-1.7-6.1-5-2.3-3.3-3.2-8-.8-4.7-.8-10.9v-27q0-1.2 1.1-1.2h9.4q1.2 0 1.2 1.2v26.7q0 4.1.3 7.3.4 3 1.3 5.2 1 2 2.6 3 1.7 1.2 4.2 1.2 2.6 0 4.3-1.1 1.6-1 2.5-3.1 1-2.1 1.3-5.2.4-3.2.4-7.3zm36 65.3q0-1 1.1-.8l1.4.3 1.7.1q3.5 0 3.5-2.5 0-3.4-5.1-3.4-.7 0-1-.4-.2-.5.2-1.2l3-5q-5.3-.5-8.9-2.4-3.6-2-5.9-5.2-2.2-3.2-3.3-7.7-1-4.6-1-10.2v-3.5q0-6 1-10.8 1.3-4.8 3.8-8 2.7-3.3 7-5 4.1-1.8 10.3-1.8 3.1 0 6.4.6 3.2.5 5.6 1.4.7.2 1 .5.2.3.2.8v5.5q0 1-1.2 1-2-.3-4.6-.4l-5-.2q-3.6 0-6.1 1-2.5 1-4 3-1.5 2.2-2.2 5.4-.6 3.2-.6 7.6v2.3q0 4.4.7 7.7.7 3.1 2.2 5.3 1.6 2 4 3 2.6 1 6.1 1l5.3-.1 5-.6q1.1 0 1.1 1.1v5.7q0 1-1.2 1.3-1.8.6-4.1 1l-4.6.6-2 3.4q6 1.4 6 6.7 0 2-.7 3.4-.7 1.5-2 2.4-1.2 1.1-2.8 1.6-1.6.5-3.5.5l-3.1-.2q-1.8-.3-2.8-.8l-.8-.5q-.2-.3-.2-.9zm49.7-12.8q-11.6 0-16.9-6.6-5.3-6.6-5.3-19.3v-2.9q0-12.8 5.3-19.3 5.3-6.6 17-6.6 11.5 0 16.8 6.6 5.3 6.5 5.3 19.3v2.9q0 12.7-5.3 19.3-5.3 6.6-16.9 6.6zm10.5-28.5q0-9-2.4-13-2.3-4-8-4-5.8 0-8.2 4-2.4 4-2.4 13v2.3q0 9 2.4 13t8.1 4q5.8 0 8-4 2.5-4 2.5-13zm-11.8-33-2-1.5q-.8-.5-1.6-.5t-1.3.6q-.4.6-.4 2v1q0 1-1.2 1h-3.9q-.7 0-1-.3l-.5-1-.5-1.5v-1.7q0-3.6 2-5.2 2.2-1.7 5.5-1.7 2.2 0 4 .6 1.7.7 3.5 2.2l2 1.5q.8.5 1.6.5.9 0 1.3-.6.5-.6.5-2.1v-.8q0-1.1 1-1.1h4q.7 0 1 .4l.5.8.4 1.6q.2.8.2 1.7 0 3.6-2.2 5.2-2 1.6-5.4 1.6-2.2 0-4-.6-1.7-.6-3.5-2.1zm49 16q-2.3 0-3 1-.8 1.1-.8 3.3v8.6h18.6q1.3 0 1.3 1.3V-2q0 1.3-1.3 1.3h-18.6v9.8q0 2.2.7 3.3.8 1 3.1 1h17.1q1.3 0 1.3 1.3v5.5q0 1.5-1.3 1.6-8.6.9-19.9.9-3.5 0-6-.6-2.4-.6-4-2-1.5-1.3-2.1-3.4-.6-2.1-.6-5.2v-32.3q0-3 .6-5.2t2.1-3.4q1.6-1.4 4-2 2.5-.6 6-.6 5.8 0 10.3.2l8.8.7q1.3 0 1.3 1.5v5.6q0 1.2-1.2 1.2zm43 45.5q-7.7 0-15.4-2-1.1-.3-1.1-1.3v-5.6q0-1.3 1.3-1.2l6.8.6q3.3.3 6.8.3 4.4 0 6-1.6 1.8-1.5 1.8-4.4 0-2.4-1.1-4.2-1.2-1.7-3.8-3l-9-4q-4.9-2.3-7-5.7-2-3.5-2-8.4 0-7.2 4-10.7 4-3.5 13-3.5 3.6 0 7.2.5 3.6.6 7 1.5.5.1.8.4.3.2.3.8v5.6q0 1.2-1.3 1.2l-6-.6-5.8-.2q-4 0-5.8 1.2-1.7 1.2-1.7 4.1 0 2.3 1.2 3.8 1.3 1.6 3.7 2.8l9.4 4.3q4.8 2.2 6.6 5.8 2 3.6 2 8.8 0 3.4-1 6.1-.9 2.7-3 4.6-2 2-5.5 3-3.4 1-8.4 1z"
                style={{ fill: fillColorPrimary }}
                transform="translate(-251.5 54.2)"
            />
        </svg>
    );
};

export default Logo;
