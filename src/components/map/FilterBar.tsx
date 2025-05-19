// src/components/map/FilterBar.tsx
/*
This will serve as part of a larger component that will be used to filter the listings on the map.
It will solely focus on presenting different options. 
*/
'use client';

import {
  HStack,
  IconButton,
  useDisclosure,
  Checkbox,
  Select,
  Show,
  Hide,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react';
import {
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
  } from '@chakra-ui/slider';
import { LuHeart, LuFilter } from 'react-icons/lu';
import { SearchBox } from '@mapbox/search-js-react';
import { useListings } from '@/store/useListings';
import '@mapbox/search-js-web/dist/mapbox-search.min.css';

export default function FilterBar() {
  const { filters, setFilters } = useListings();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra v3

  const content = (
    <>
      <HStack mb={4}>
        <SearchBox
          accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
          mapboxgl={null as any}
          onRetrieve={(f: any) => f && setFilters({ /* center later */ })}
        />

        <IconButton
          aria-label="Favourites"
          icon={<LuHeart />}
          variant="ghost"
          colorScheme={filters.favoritesOnly ? 'pink' : 'gray'}
          onClick={() => setFilters({ favoritesOnly: !filters.favoritesOnly })}
        />
      </HStack>

      <RangeSlider
        min={0}
        max={2_000_000}
        step={10_000}
        defaultValue={filters.price}
        onChangeEnd={(val) => setFilters({ price: val as [number, number] })}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} />
        <RangeSliderThumb index={1} />
      </RangeSlider>

      <Checkbox
        mt={4}
        isChecked={filters.assumableOnly}
        onChange={(e) => setFilters({ assumableOnly: e.target.checked })}
      >
        Assumable mortgages only
      </Checkbox>

      <Select
        mt={4}
        placeholder="Any age"
        value={filters.maxAgeDays ?? ''}
        onChange={(e) =>
          setFilters({ maxAgeDays: e.target.value ? +e.target.value : null })
        }
      >
        <option value="7">New this week</option>
        <option value="30">≤ 30 days</option>
        <option value="90">≤ 90 days</option>
      </Select>
    </>
  );

  return (
    <>
      <Hide below="md">
        <HStack p={3} bg="white" borderBottomWidth="1px" gap={6}>
          {content}
        </HStack>
      </Hide>

      <Show below="md">
        <IconButton aria-label="Filters" icon={<LuFilter />} onClick={onOpen} />
        <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>Filters</DrawerHeader>
            <DrawerBody>{content}</DrawerBody>
          </DrawerContent>
        </Drawer>
      </Show>
    </>
  );
}
