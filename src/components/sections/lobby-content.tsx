"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, ThumbsUp, LayoutGrid, Spade, Trophy, Gamepad2, Bird, Club, Fish, Ticket, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Types
interface Game {
    id: string;
    name: string;
    image: string;
    provider?: string;
    isHot?: boolean;
    isNew?: boolean;
    tag?: string;
}

interface CategorySection {
    id: string;
    title: string;
    icon: any;
    count: number;
    games: Game[];
    color: string; // Icon color
}

// Mock Data
const categories: CategorySection[] = [
    {
        id: 'hot',
        title: 'Hot',
        icon: Flame,
        count: 22,
        color: 'text-orange-500',
        games: [
            { id: 'h1', name: 'Pinata Wins', image: 'https://v3.fal.media/files/tiger/US1z1oBBnUZGRKtXXb86w_output.png', provider: 'PG', isHot: true },
            { id: 'h2', name: 'Money Coming', image: 'https://v3.fal.media/files/koala/0AnBO-Dx8RCvMj5vssF9v_output.png', provider: 'JILI', tag: '10000X' },
            { id: 'h3', name: 'Circus Joker', image: 'https://v3.fal.media/files/elephant/ILkEO6gBUSCsrh9b-bBtH_output.png', provider: 'JILI' },
            { id: 'h4', name: 'Magic Ace', image: 'https://v3.fal.media/files/penguin/cWeb1Nu0nz79XOQzC1lRV_output.png', provider: 'JDB' },
            { id: 'h5', name: 'Crazy Time', image: 'https://v3.fal.media/files/monkey/Dll0mczrVKZYCTOigIoLL_output.png', provider: 'Evolution' },
            { id: 'h6', name: 'Treasures of Aztec', image: 'https://v3.fal.media/files/koala/VeCElJ_VB0Ku6Xmo8Vz4h_output.png', provider: 'PG' },
        ]
    },
    {
        id: 'recommend',
        title: 'Recommend',
        icon: ThumbsUp,
        count: 745,
        color: 'text-orange-400',
        games: [
            { id: 'r1', name: 'Fruity Bonanza', image: 'https://v3.fal.media/files/kangaroo/Ok1Pi6_uTGoThL7eivq90_output.png', provider: 'JDB' },
            { id: 'r2', name: 'Jackpot Joker', image: 'https://v3.fal.media/files/rabbit/aLEXMOKgAiZv66Qq8zAVc_output.png', provider: 'JILI' },
            { id: 'r3', name: '3 Coin Volcano', image: 'https://v3.fal.media/files/penguin/VTYYyOoJHSasqapk8hPr3_output.png', provider: 'BNG' },
            { id: 'r4', name: 'Free Drop', image: 'https://v3.fal.media/files/penguin/jwLf3S55fiBQKLHvfJyVH_output.png', provider: 'Gemini' },
        ]
    },
    {
        id: 'sports',
        title: 'Sports',
        icon: Trophy,
        count: 9,
        color: 'text-orange-500',
        games: [
            { id: 'sp1', name: '9Wickets', image: 'https://v3.fal.media/files/monkey/Oya4bNlocaOjMzIHnkPiN_output.png', provider: '9Wickets' },
            { id: 'sp2', name: 'Lucky Sports', image: 'https://v3.fal.media/files/tiger/US1z1oBBnUZGRKtXXb86w_output.png', provider: 'Lucky' },
            { id: 'sp3', name: 'FB Sports', image: 'https://v3.fal.media/files/kangaroo/ZPFKXr5kPwJ25rDgOBpVe_output.png', provider: 'FB' },
        ]
    },
    {
        id: 'slots',
        title: 'Slots',
        icon: LayoutGrid,
        count: 7364,
        color: 'text-orange-500',
        games: [
            { id: 's1', name: 'Super Ace', image: 'https://v3.fal.media/files/koala/EhxVmzU0Pqk9zvk6p8G5K_output.png', provider: 'JILI' },
            { id: 's2', name: 'Wild Bounty Showdown', image: 'https://v3.fal.media/files/panda/Y3n9ZFl8RePKuonGulImg_output.png', provider: 'PG' },
            { id: 's3', name: 'Super Elements', image: 'https://v3.fal.media/files/elephant/qfLxnZgwR4BWxB98iQlri_output.png', provider: 'FC' },
            { id: 's4', name: 'Aviator', image: 'https://v3.fal.media/files/lion/Xyv0y15d0vP068fqefxTi_output.png', provider: 'SPRIBE' },
            { id: 's5', name: 'Boxing King', image: 'https://v3.fal.media/files/rabbit/qdpVP77rdxngzKTAT2uk4_output.png', provider: 'JILI' },
            { id: 's6', name: 'Fortune Gems', image: 'https://v3.fal.media/files/zebra/Yfq5lsnIUPdueGPNBBIGs_output.png', provider: 'JILI' },
        ]
    },
    {
        id: 'live',
        title: 'Live',
        icon: Spade,
        count: 884,
        color: 'text-orange-400',
        games: [
            { id: 'l1', name: 'Crazy Time', image: 'https://v3.fal.media/files/rabbit/2GXI-xlBfTSc04d-2ZCqh_output.png', provider: 'Evolution' },
            { id: 'l2', name: 'Mega Wheel', image: 'https://v3.fal.media/files/monkey/Dll0mczrVKZYCTOigIoLL_output.png', provider: 'Pragmatic Play' },
            { id: 'l3', name: 'Live Roulette', image: 'https://v3.fal.media/files/koala/VeCElJ_VB0Ku6Xmo8Vz4h_output.png', provider: 'Evolution' },
        ]
    },
    {
        id: 'esports',
        title: 'E-sports',
        icon: Gamepad2,
        count: 2,
        color: 'text-orange-400',
        games: [
            { id: 'es1', name: 'TF Gaming', image: 'https://v3.fal.media/files/kangaroo/lYHaR_DETnLxNzv5Qx5vs_output.png', provider: 'TF' },
            { id: 'es2', name: 'IA E-Sports', image: 'https://v3.fal.media/files/panda/8PzjIC3DLmmzqirl5FTyl_output.png', provider: 'IA' },
        ]
    },
    {
        id: 'cockfight',
        title: 'Cockfight',
        icon: Bird,
        count: 1,
        color: 'text-orange-500',
        games: [
            { id: 'cf1', name: 'SV388', image: 'https://v3.fal.media/files/koala/0AnBO-Dx8RCvMj5vssF9v_output.png', provider: 'Venus' },
        ]
    },
    {
        id: 'poker',
        title: 'Poker',
        icon: Club,
        count: 129,
        color: 'text-orange-400',
        games: [
            { id: 'pk1', name: 'Andar Bahar', image: 'https://v3.fal.media/files/penguin/4h35WftNO-_GdhZusBMWQ_output.png', provider: 'JILI' },
            { id: 'pk2', name: '7 Up 7 Down', image: 'https://v3.fal.media/files/penguin/cWeb1Nu0nz79XOQzC1lRV_output.png', provider: 'KingMaker' },
            { id: 'pk3', name: 'Rummy', image: 'https://v3.fal.media/files/penguin/8bEOMfjhp6GRTLreMg1ID_output.png', provider: 'JILI' },
            { id: 'pk4', name: 'Jogo do Bozo', image: 'https://v3.fal.media/files/elephant/ILkEO6gBUSCsrh9b-bBtH_output.png', provider: 'KingMaker' },
        ]
    },
    {
        id: 'fish',
        title: 'Fish',
        icon: Fish,
        count: 173,
        color: 'text-orange-500',
        games: [
            { id: 'f1', name: 'Fortune King', image: 'https://v3.fal.media/files/tiger/fxGXhvVyUzh7XBkPkrLOk_output.png', provider: 'JILI' },
            { id: 'f2', name: 'Jackpot Fishing', image: 'https://v3.fal.media/files/kangaroo/Ok1Pi6_uTGoThL7eivq90_output.png', provider: 'JILI' },
            { id: 'f3', name: 'Fortune Zombie', image: 'https://v3.fal.media/files/penguin/VTYYyOoJHSasqapk8hPr3_output.png', provider: 'JILI' },
            { id: 'f4', name: 'Happy Fishing', image: 'https://v3.fal.media/files/rabbit/aLEXMOKgAiZv66Qq8zAVc_output.png', provider: 'JILI' },
        ]
    },
    {
        id: 'lottery',
        title: 'Lottery',
        icon: Ticket,
        count: 1,
        color: 'text-orange-400',
        games: [
            { id: 'lt1', name: 'TC Gaming', image: 'https://v3.fal.media/files/penguin/jwLf3S55fiBQKLHvfJyVH_output.png', provider: 'TC Gaming' },
        ]
    },
];

const GameCard = ({ game, sectionId }: { game: Game; sectionId: string }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <div className="relative group flex-shrink-0 w-28 md:w-32 cursor-pointer">
            <div className="relative overflow-hidden rounded-xl border border-border bg-card aspect-[3/4]">
                <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                {/* Provider Logo / Name */}
                <div className="absolute bottom-2 left-0 right-0 text-center">
                    {game.provider && (
                        <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider drop-shadow-md">
                            {game.provider}
                        </span>
                    )}
                </div>

                {/* Favorite Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors"
                >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white text-white' : 'text-white'}`} />
                </button>

                {/* Tag (e.g. 10000X) */}
                {game.tag && (
                    <div className="absolute top-0 left-0 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm">
                        {game.tag}
                    </div>
                )}
            </div>

            {/* Game Name */}
            <div className="mt-1.5 text-center">
                <h3 className="text-xs font-medium text-foreground line-clamp-1 leading-tight">
                    {game.name}
                </h3>
            </div>
        </div>
    );
};

const SectionHeader = ({ title, icon: Icon, count, color }: { title: string; icon: any; count: number; color: string }) => (
    <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-7 px-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 text-xs font-bold rounded-full">
                All {count}
            </Button>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-accent hover:bg-accent/80 text-muted-foreground">
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-orange-500 hover:bg-orange-600 text-white">
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    </div>
);

export default function LobbyContent() {
    return (
        <div className="space-y-8 pb-20">
            {categories.map((category) => (
                <section key={category.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <SectionHeader
                        title={category.title}
                        icon={category.icon}
                        count={category.count}
                        color={category.color}
                    />

                    <div
                        className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        {category.games.map((game) => (
                            <GameCard key={game.id} game={game} sectionId={category.id} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
