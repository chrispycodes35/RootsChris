// src/components/map/FilterBar.tsx
/*
This will serve as part of a larger component that will be used to filter the listings on the map.
It will solely focus on presenting different options. 
*/
// src/components/map/FilterBar.tsx  (new)
'use client';

import { Box, HStack, Text, IconButton, Tooltip, useColorModeValue, Popover, PopoverTrigger, PopoverContent, PopoverBody, Input, Select, Button, VStack } from '@chakra-ui/react';
import { LuHeart, LuBuilding2, LuDollarSign } from 'react-icons/lu';
import { useFavorites } from '@/store/useFavorites';
import { useState } from 'react';

interface FilterState {
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  onlyFavs: boolean;
}

export default function FilterBar() {
  const { onlyFavs, setOnlyFavs } = useFavorites();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    onlyFavs: false
  });

  const [activeFilters, setActiveFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    onlyFavs: false
  });

  const handleApplyFilters = () => {
    setActiveFilters(filters);
    setOnlyFavs(filters.onlyFavs);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      onlyFavs: false
    };
    setFilters(clearedFilters);
    setActiveFilters(clearedFilters);
    setOnlyFavs(false);
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => 
    value !== '' && value !== false
  );

  return (
    <Box
      px="4"
      py="3"
      bg={bgColor}
      borderBottomWidth="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <HStack spacing={6} align="center" justify="space-between">
        <HStack spacing={6}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            Filters:
          </Text>
          
          <HStack spacing={4}>
            <Tooltip label={filters.onlyFavs ? "Show all listings" : "Show only favorites"}>
              <IconButton
                aria-label={filters.onlyFavs ? 'Show all listings' : 'Show only favourites'}
                icon={<LuHeart />}
                variant="ghost"
                size="md"
                colorScheme={filters.onlyFavs ? 'pink' : 'gray'}
                onClick={() => setFilters(prev => ({ ...prev, onlyFavs: !prev.onlyFavs }))}
              />
            </Tooltip>

            <Popover placement="bottom-start">
              <PopoverTrigger>
                <IconButton
                  aria-label="Filter by price"
                  icon={<LuDollarSign />}
                  variant="ghost"
                  size="md"
                  colorScheme="gray"
                />
              </PopoverTrigger>
              <PopoverContent width="300px">
                <PopoverBody p={4}>
                  <VStack spacing={4}>
                    <Text fontSize="sm" fontWeight="medium">Price Range</Text>
                    <HStack>
                      <Input
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                        size="sm"
                      />
                      <Text>-</Text>
                      <Input
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                        size="sm"
                      />
                    </HStack>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>

            <Popover placement="bottom-start">
              <PopoverTrigger>
                <IconButton
                  aria-label="Filter by property type"
                  icon={<LuBuilding2 />}
                  variant="ghost"
                  size="md"
                  colorScheme="gray"
                />
              </PopoverTrigger>
              <PopoverContent width="200px">
                <PopoverBody p={4}>
                  <VStack spacing={4}>
                    <Text fontSize="sm" fontWeight="medium">Property Type</Text>
                    <Select
                      value={filters.propertyType}
                      onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                      size="sm"
                    >
                      <option value="">All Types</option>
                      <option value="house">House</option>
                      <option value="condo">Condo</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="land">Land</option>
                    </Select>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </HStack>
        </HStack>

        <HStack spacing={2}>
          <Button
            size="sm"
            colorScheme="green"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="gray"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          )}
        </HStack>
      </HStack>
    </Box>
  );
}
