import { useEffect, useRef, useState } from "react";

import PitchSelector from "../components/createMeditation/PitchSelector";
import AtmosphereSelector from "../components/createMeditation/AtmosphereSelector";
import MusicalThemeSelector from "../components/createMeditation/MusicalThemeSelector";
import NatureSoundsMixer from "../components/createMeditation/NatureSoundsMixer";
import MeditationActions from "../components/createMeditation/MeditationActions";

function CreateMeditation() {
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  const [selectedPitch, setSelectedPitch] = useState("dark");
  const [selectedAtmosphere, setSelectedAtmosphere] = useState("airy");
  const [isAtmosphereEnabled, setIsAtmosphereEnabled] = useState(true);

  const [rainVolume, setRainVolume] = useState(35);
  const [forestVolume, setForestVolume] = useState(20);
  const [birdsVolume, setBirdsVolume] = useState(25);
  const [riverVolume, setRiverVolume] = useState(0);
  const [wavesVolume, setWavesVolume] = useState(40);

  const audioContextRef = useRef(null);

  const audioOneRef = useRef(null);
  const audioTwoRef = useRef(null);

  const gainOneRef = useRef(null);
  const gainTwoRef = useRef(null);

  const activeAudioRef = useRef(null);
  const inactiveAudioRef = useRef(null);

  const activeGainRef = useRef(null);
  const inactiveGainRef = useRef(null);

  const natureAudioRef = useRef({});
  const natureGainRef = useRef({});

  const crossfadeTimeoutRef = useRef(null);
  const pauseTimeoutRef = useRef(null);

  useEffect(() => {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    const audioContext = new AudioContext();

    const initialAudioPath = `${
      import.meta.env.BASE_URL
    }audio/pads/airy-dark.wav`;

    const audioOne = new Audio(initialAudioPath);
    const audioTwo = new Audio(initialAudioPath);

    audioOne.loop = true;
    audioTwo.loop = true;

    const sourceOne =
      audioContext.createMediaElementSource(audioOne);

    const sourceTwo =
      audioContext.createMediaElementSource(audioTwo);

    const gainOne = audioContext.createGain();
    const gainTwo = audioContext.createGain();

    gainOne.gain.value = 0;
    gainTwo.gain.value = 0;

    sourceOne.connect(gainOne);
    gainOne.connect(audioContext.destination);

    sourceTwo.connect(gainTwo);
    gainTwo.connect(audioContext.destination);

    audioContextRef.current = audioContext;

    audioOneRef.current = audioOne;
    audioTwoRef.current = audioTwo;

    gainOneRef.current = gainOne;
    gainTwoRef.current = gainTwo;

    activeAudioRef.current = audioOne;
    inactiveAudioRef.current = audioTwo;

    activeGainRef.current = gainOne;
    inactiveGainRef.current = gainTwo;

    const natureSounds = [
      "rain",
      "forest",
      "birds",
      "river",
      "waves",
    ];

    natureSounds.forEach((sound) => {
      const audio = new Audio(
        `${import.meta.env.BASE_URL}audio/nature/${sound}.wav`
      );

      audio.loop = true;

      const source =
        audioContext.createMediaElementSource(audio);

      const gain = audioContext.createGain();

      gain.gain.value = 0;

      source.connect(gain);
      gain.connect(audioContext.destination);

      natureAudioRef.current[sound] = audio;
      natureGainRef.current[sound] = gain;
    });

    return () => {
      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current);
      }

      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }

      audioOne.pause();
      audioTwo.pause();

      Object.values(natureAudioRef.current).forEach((audio) => {
        audio.pause();
      });

      audioContext.close();
    };
  }, []);

  useEffect(() => {
    const audioContext = audioContextRef.current;

    const activeAudio = activeAudioRef.current;
    const inactiveAudio = inactiveAudioRef.current;

    const activeGain = activeGainRef.current;
    const inactiveGain = inactiveGainRef.current;

    if (
      !audioContext ||
      !activeAudio ||
      !inactiveAudio ||
      !activeGain ||
      !inactiveGain
    ) {
      return;
    }

    const now = audioContext.currentTime;

    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    activeGain.gain.cancelScheduledValues(now);
    inactiveGain.gain.cancelScheduledValues(now);

    if (isPreviewPlaying) {
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      activeAudio.play();

      activeGain.gain.setValueAtTime(
        activeGain.gain.value,
        now
      );

      activeGain.gain.linearRampToValueAtTime(
        isAtmosphereEnabled ? 1 : 0,
        now + 1.5
      );

      const natureVolumes = {
        rain: rainVolume,
        forest: forestVolume,
        birds: birdsVolume,
        river: riverVolume,
        waves: wavesVolume,
      };

      Object.entries(natureAudioRef.current).forEach(
        ([sound, audio]) => {
          const gain = natureGainRef.current[sound];
          const targetVolume = natureVolumes[sound] / 100;

          audio.play();

          gain.gain.cancelScheduledValues(now);

          gain.gain.setValueAtTime(
            gain.gain.value,
            now
          );

          gain.gain.linearRampToValueAtTime(
            targetVolume,
            now + 1.5
          );
        }
      );
    } else {
      activeGain.gain.setValueAtTime(
        activeGain.gain.value,
        now
      );

      activeGain.gain.linearRampToValueAtTime(
        0,
        now + 0.6
      );

      inactiveGain.gain.setValueAtTime(
        inactiveGain.gain.value,
        now
      );

      inactiveGain.gain.linearRampToValueAtTime(
        0,
        now + 0.6
      );

      Object.values(natureGainRef.current).forEach(
        (gain) => {
          gain.gain.cancelScheduledValues(now);

          gain.gain.setValueAtTime(
            gain.gain.value,
            now
          );

          gain.gain.linearRampToValueAtTime(
            0,
            now + 0.6
          );
        }
      );

      pauseTimeoutRef.current = setTimeout(() => {
        audioOneRef.current?.pause();
        audioTwoRef.current?.pause();

        Object.values(natureAudioRef.current).forEach(
          (audio) => {
            audio.pause();
          }
        );

        pauseTimeoutRef.current = null;
      }, 650);
    }
  }, [isPreviewPlaying]);

  useEffect(() => {
    const audioContext = audioContextRef.current;

    const activeAudio = activeAudioRef.current;
    const inactiveAudio = inactiveAudioRef.current;

    const activeGain = activeGainRef.current;
    const inactiveGain = inactiveGainRef.current;

    if (
      !audioContext ||
      !activeAudio ||
      !inactiveAudio ||
      !activeGain ||
      !inactiveGain
    ) {
      return;
    }

    const newAudioPath = `${
      import.meta.env.BASE_URL
    }audio/pads/${selectedAtmosphere}-${selectedPitch}.wav`;

    if (!isPreviewPlaying) {
      activeAudio.src = newAudioPath;
      activeAudio.loop = true;
      activeAudio.currentTime = 0;

      return;
    }

    if (crossfadeTimeoutRef.current) {
      clearTimeout(crossfadeTimeoutRef.current);
      crossfadeTimeoutRef.current = null;
    }

    const now = audioContext.currentTime;

    activeGain.gain.cancelScheduledValues(now);
    inactiveGain.gain.cancelScheduledValues(now);

    inactiveAudio.pause();

    inactiveAudio.src = newAudioPath;
    inactiveAudio.loop = true;

    try {
      inactiveAudio.currentTime = activeAudio.currentTime;
    } catch {
      inactiveAudio.currentTime = 0;
    }

    inactiveGain.gain.setValueAtTime(0, now);

    inactiveAudio.play();

    activeGain.gain.setValueAtTime(
      activeGain.gain.value,
      now
    );

    activeGain.gain.linearRampToValueAtTime(
      0,
      now + 0.5
    );

    inactiveGain.gain.linearRampToValueAtTime(
      isAtmosphereEnabled ? 1 : 0,
      now + 0.5
    );

    crossfadeTimeoutRef.current = setTimeout(() => {
      activeAudio.pause();

      activeAudioRef.current = inactiveAudio;
      inactiveAudioRef.current = activeAudio;

      activeGainRef.current = inactiveGain;
      inactiveGainRef.current = activeGain;

      crossfadeTimeoutRef.current = null;
    }, 550);
  }, [
    selectedPitch,
    selectedAtmosphere,
    isPreviewPlaying,
  ]);

  useEffect(() => {
    const audioContext = audioContextRef.current;

    if (!audioContext || !isPreviewPlaying) {
      return;
    }

    const activeGain = activeGainRef.current;
    const inactiveGain = inactiveGainRef.current;

    if (!activeGain || !inactiveGain) {
      return;
    }

    const now = audioContext.currentTime;

    activeGain.gain.cancelScheduledValues(now);
    inactiveGain.gain.cancelScheduledValues(now);

    activeGain.gain.setValueAtTime(
      activeGain.gain.value,
      now
    );

    inactiveGain.gain.setValueAtTime(
      inactiveGain.gain.value,
      now
    );

    if (isAtmosphereEnabled) {
      activeGain.gain.linearRampToValueAtTime(
        1,
        now + 0.4
      );
    } else {
      activeGain.gain.linearRampToValueAtTime(
        0,
        now + 0.4
      );

      inactiveGain.gain.linearRampToValueAtTime(
        0,
        now + 0.4
      );
    }
  }, [isAtmosphereEnabled]);

  useEffect(() => {
    const audioContext = audioContextRef.current;

    if (!audioContext || !isPreviewPlaying) {
      return;
    }

    const volumes = {
      rain: rainVolume,
      forest: forestVolume,
      birds: birdsVolume,
      river: riverVolume,
      waves: wavesVolume,
    };

    const now = audioContext.currentTime;

    Object.entries(volumes).forEach(
      ([sound, volume]) => {
        const gain = natureGainRef.current[sound];

        if (!gain) {
          return;
        }

        gain.gain.cancelScheduledValues(now);

        gain.gain.setValueAtTime(
          gain.gain.value,
          now
        );

        gain.gain.linearRampToValueAtTime(
          volume / 100,
          now + 0.15
        );
      }
    );
  }, [
    rainVolume,
    forestVolume,
    birdsVolume,
    riverVolume,
    wavesVolume,
    isPreviewPlaying,
  ]);

  return (
    <div className="px-2 py-5 text-astraya-text">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <MeditationActions
          isPreviewPlaying={isPreviewPlaying}
          setIsPreviewPlaying={setIsPreviewPlaying}
        />

        <PitchSelector
          selectedPitch={selectedPitch}
          setSelectedPitch={setSelectedPitch}
        />

        <AtmosphereSelector
          selectedAtmosphere={selectedAtmosphere}
          setSelectedAtmosphere={setSelectedAtmosphere}
          isAtmosphereEnabled={isAtmosphereEnabled}
          setIsAtmosphereEnabled={setIsAtmosphereEnabled}
        />

        <MusicalThemeSelector />

        <NatureSoundsMixer
          rainVolume={rainVolume}
          setRainVolume={setRainVolume}
          forestVolume={forestVolume}
          setForestVolume={setForestVolume}
          birdsVolume={birdsVolume}
          setBirdsVolume={setBirdsVolume}
          riverVolume={riverVolume}
          setRiverVolume={setRiverVolume}
          wavesVolume={wavesVolume}
          setWavesVolume={setWavesVolume}
        />
      </div>
    </div>
  );
}

export default CreateMeditation;