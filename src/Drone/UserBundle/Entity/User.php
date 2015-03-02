<?php

namespace Drone\UserBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Drone\MapBundle\Entity\Map as Map;

/**
 * @ORM\Entity
 * @ORM\Table(name="fos_user")
 * @Vich\Uploadable
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\OneToMany(targetEntity="Drone\MapBundle\Entity\Field", mappedBy="user")
     **/
    private $fields;

    /**
     * @var string
     *
     * @ORM\Column(name="address", type="string", length=255, nullable=false)
     */
    private $address;

    /**
     * @var string
     *
     * @ORM\Column(name="zipcode", type="string", length=10, nullable=false)
     */
    private $zipcode;

    /**
     * @var string
     *
     * @ORM\Column(name="country", type="string", length=50, nullable=false)
     */
    private $country;

    /**
     * @Vich\UploadableField(mapping="user_image", fileNameProperty="userImage", nullable=true)
     *
     * @var File $imageFile
     */
    protected $imageFile;

    /**
     * @ORM\Column(type="string", length=255, name="user_image", nullable=true)
     *
     * @var string $userImage
     */
    protected $userImage;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     *
     * @var \DateTime $updatedAt
     */
    protected $updatedAt;

    public function __construct()
    {
        parent::__construct();
        $this->maps = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Add maps
     *
     * @param \Drone\UserBundle\Entity\Map $maps
     * @return User
     */
    public function addMap(\Drone\UserBundle\Entity\Map $maps)
    {
        $this->maps[] = $maps;

        return $this;
    }

    /**
     * Remove maps
     *
     * @param \Drone\UserBundle\Entity\Map $maps
     */
    public function removeMap(\Drone\UserBundle\Entity\Map $maps)
    {
        $this->maps->removeElement($maps);
    }

    /**
     * Get maps
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getMaps()
    {
        return $this->maps;
    }

    /**
     * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile $image
     */
    public function setImageFile(File $image = null)
    {
        $this->imageFile = $image;

        if ($image) {
            $this->updatedAt = new \DateTime('now');
        }
    }

    /**
     * @return File
     */
    public function getImageFile()
    {
        return $this->imageFile;
    }

    /**
     * @param string $userImage
     */
    public function setUserImage($userImage)
    {
        $this->userImage = $userImage;
    }

    /**
     * @return string
     */
    public function getUserImage()
    {
        return $this->userImage;
    }

    /**
     * Set address
     *
     * @param string $address
     * @return User
     */
    public function setAddress($address)
    {
        $this->address = $address;

        return $this;
    }

    /**
     * Get address
     *
     * @return string 
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set zipcode
     *
     * @param string $zipcode
     * @return User
     */
    public function setZipcode($zipcode)
    {
        $this->zipcode = $zipcode;

        return $this;
    }

    /**
     * Get zipcode
     *
     * @return string 
     */
    public function getZipcode()
    {
        return $this->zipcode;
    }

    /**
     * Set country
     *
     * @param string $country
     * @return User
     */
    public function setCountry($country)
    {
        $this->country = $country;

        return $this;
    }

    /**
     * Get country
     *
     * @return string 
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     * @return User
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime 
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * Add fields
     *
     * @param \Drone\MapBundle\Entity\Field $fields
     * @return User
     */
    public function addField(\Drone\MapBundle\Entity\Field $fields)
    {
        $this->fields[] = $fields;

        return $this;
    }

    /**
     * Remove fields
     *
     * @param \Drone\MapBundle\Entity\Field $fields
     */
    public function removeField(\Drone\MapBundle\Entity\Field $fields)
    {
        $this->fields->removeElement($fields);
    }

    /**
     * Get fields
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getFields()
    {
        return $this->fields;
    }
}
